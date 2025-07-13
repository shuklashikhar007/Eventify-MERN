package models

import "time"

// User model
type User struct {
	ID            string         `gorm:"primaryKey" json:"ID"`
    CreatedAt     time.Time
    UpdatedAt     time.Time

	Name          string         `gorm:"size:100" json:"name" binding:"required,max=100"`
	ImageURL      string         `gorm:"size:255" json:"image_url" binding:"omitempty,url"`

	ProviderID    string         `gorm:"size:255;unique" json:"provider_id"`
	Email         string         `gorm:"size:100" json:"email" binding:"required,email"`
}
