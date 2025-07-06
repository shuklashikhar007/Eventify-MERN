package repository

import (
	"errors"
	"time"

	"gorm.io/gorm"

	"github.com/google/uuid"
	"github.com/shuklashikhar007/Eventify/backend/internal/models"
)

type EventRepository struct {
	db *gorm.DB
}

func NewEventRepository(db *gorm.DB) *EventRepository {
	return &EventRepository{db: db}
}

// All returns all event from the database without event updaters details.
func (r *EventRepository) All() ([]models.Event, error) {
	var list []models.Event
	return list, r.db.Preload("CreatedBy").Find(&list).Error
}

// GetById returns a event by its ID
func (r *EventRepository) GetById(eventID string) (models.Event, error) {
	var event models.Event
	return event, r.db.Preload("CreatedBy").Preload("EventUpdaters").Preload("EventUpdaters.UpdatedBy").First(&event, "event_id = ?", eventID).Error
}

// CreateNewEvent creates a new event in the database
func (r *EventRepository) CreateNewEvent(createrId string, event *models.Event) (models.Event, error) {
	event.CreatedByID = createrId
	event.EventUpdaters = []models.EventUpdater{}

	if event.EventStartTime.After(event.EventEndTime) {
		return *event, errors.New("event start time cannot be after end time")
	}

	err := r.db.Transaction(func(tx *gorm.DB) error {
		if err := r.db.Create(&event).Error; err != nil {
			return err
		}

		event_fetched, err := r.GetById(event.EventID)
		if err != nil {
			return err
		}

		event = &event_fetched
		return nil
	})

	return *event, err
}

// DeleteEventById deletes an existing event by its ID
func (r *EventRepository) DeleteEventById(eventID string, createrID string) (string, error) {
	var event models.Event

	if err := r.db.First(&event, "event_id = ?", eventID).Error; err != nil {
		return event.EventID, err // Not found or other DB error
	}

	if event.CreatedByID != createrID {
		return event.EventID, errors.New("unauthorized: only the creator can delete the event")
	}

	return event.EventID, r.db.Delete(&event).Error
}

type UpdateInputEvent struct {
	Title          string         `json:"title" binding:"max=200"`
	Description    string         `json:"description" binding:"max=1000"`
	Location       string         `json:"location" binding:"max=255"`
	EventStartTime time.Time      `json:"event_start_time"`
	EventEndTime   time.Time      `json:"event_end_time"`

	IsCanceled     bool           `json:"is_canceled"`
	IsRescheduled  bool           `json:"is_rescheduled"`
}

// UpdateEvent updates an existing event in the database
func (r *EventRepository) UpdateEvent(UpdaterID string, EventID string, updatedEvent *UpdateInputEvent) (models.Event, error) {
	var event models.Event

	err := r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&event, "event_id = ?", EventID).Error; err != nil {
			return err
		}

		if updatedEvent.Title != "" {
			event.Title = updatedEvent.Title
		}
		if updatedEvent.Description != "" {
			event.Description = updatedEvent.Description
		}
		if updatedEvent.Location != "" {
			event.Location = updatedEvent.Location
		}
		if !updatedEvent.EventStartTime.IsZero() {
			event.EventStartTime = updatedEvent.EventStartTime
		}
		if !updatedEvent.EventEndTime.IsZero() {
			event.EventEndTime = updatedEvent.EventEndTime
		}
		if event.EventStartTime.After(event.EventEndTime) {
			return errors.New("event start time cannot be after end time")
		}

		// For booleans, we assume caller always intends to update explicitly
		event.IsCanceled = updatedEvent.IsCanceled
		event.IsRescheduled = updatedEvent.IsRescheduled

		// Always update UpdatedAt
		event.UpdatedAt = time.Now()

		// Save changes
		if err := tx.Save(&event).Error; err != nil {
			return err
		}

		// Create EventUpdater record
		updater := models.EventUpdater{
			EventUpdaterID: uuid.New().String(),
			RefEventID:     EventID,
			UpdatedByID:    UpdaterID,
			UpdatedAt:      event.UpdatedAt,
		}

		if err := tx.Create(&updater).Error; err != nil {
			return err
		}

		return tx.Preload("CreatedBy").Preload("EventUpdaters").Preload("EventUpdaters.UpdatedBy").First(&event, "event_id = ?", EventID).Error
	})

	return event, err
}
