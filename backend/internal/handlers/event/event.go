package event

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shuklashikhar007/Eventify/backend/internal/middleware"
	"github.com/shuklashikhar007/Eventify/backend/internal/models"
	"github.com/shuklashikhar007/Eventify/backend/internal/repository"
)

type EventHandler struct{
	eventRepo *repository.EventRepository
}

func NewEventHandler(eventRepo *repository.EventRepository) *EventHandler {
	return &EventHandler{
		eventRepo,
	}
}

// RegisterRoutes initializes the event routes for the application.
//
// Routes:
//     - GET /event/: Returns list of all events without event updaters details.
//
// 	   - GET /event/:event_id: Returns a specific event by its ID.
//     - DELETE /event/:event_id: Deletes a specific event by its ID.
//     - PUT /event/:event_id: Updates a specific event by its ID.
//
//     - POST /event: Allows authenticated users to create a new event.
//     - GET /event/protected: A protected route that requires user authentication.
func (h *EventHandler) RegisterRoutes(r *gin.RouterGroup) {
	eventGroup := r.Group("/event")

	eventGroup.GET("/", h.AllEvents)

	eventGroup.GET("/:event_id", h.GetEventByID) // Get event by ID
	eventGroup.DELETE("/:event_id", middleware.UserAuthMiddleware, h.DeleteEventByID) // Delete event by ID
	eventGroup.PUT("/:event_id", middleware.UserAuthMiddleware, h.UpdateEventByID) // Update event by ID

	eventGroup.POST("/", middleware.UserAuthMiddleware, h.CreateEvent)
	eventGroup.GET("/protected", middleware.UserAuthMiddleware, h.ProtectedRoute)
}

// path: GET /event
// description: AllEvents route that returns a simple "OK" response.
func (h *EventHandler) AllEvents(c *gin.Context) {
	events, err := h.eventRepo.All()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch events"})
		return
	}

	c.JSON(http.StatusOK, gin.H{ "events": events })
}

// path: GET /event/:event_id
// description: returns a specific event by its ID.
func (h *EventHandler) GetEventByID(c *gin.Context) {
	eventID := c.Param("event_id")
	event, err := h.eventRepo.GetById(eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{ "event": event })
}

// path: DELETE /event/:event_id
// description: allows authenticated owner to deletes a specific event by its ID.
func (h *EventHandler) DeleteEventByID(c *gin.Context) {
	rawUser, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	user := rawUser.(models.User)
	eventID := c.Param("event_id")

	eventID, err := h.eventRepo.DeleteEventById(eventID, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{ "event_id": eventID })
}

// path: PUT /event/:event_id
// description: allows authenticated users to update a existing event.
func (h *EventHandler) UpdateEventByID(c *gin.Context) {
	rawUser, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	user := rawUser.(models.User)
	eventID := c.Param("event_id")

	var input repository.UpdateInputEvent
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event, err := h.eventRepo.UpdateEvent(user.ID, eventID, &input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{ "event": event })
}

// path: POST /event
// description: allows authenticated users to create a new event.
func (h *EventHandler) CreateEvent(c *gin.Context) {
	rawUser, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	user := rawUser.(models.User)

	var event models.Event
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event, err := h.eventRepo.CreateNewEvent(user.ID, &event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{ "event": event })
}

// path: GET /event/protected
// description: Protected home route that returns a simple "OK" response.
func (h *EventHandler) ProtectedRoute(c *gin.Context) {
	c.String(http.StatusOK, "OK")
}