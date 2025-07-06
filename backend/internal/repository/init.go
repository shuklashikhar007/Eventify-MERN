package repository

import "github.com/shuklashikhar007/Eventify/backend/internal/db"

var UserRepo *UserRepository
var EventRepo *EventRepository

// Creating bean of all the repositories
func InitializeRepositories() {
	UserRepo = NewUserRepository(db.DB) // bean of user repository
	EventRepo = NewEventRepository(db.DB) // bean of event repository
}