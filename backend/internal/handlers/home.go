package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shuklashikhar007/Eventify/backend/internal/handlers/auth"
	"github.com/shuklashikhar007/Eventify/backend/internal/handlers/event"
	"github.com/shuklashikhar007/Eventify/backend/internal/repository"
)

// SetupHomeRoutes initializes the home routes for the application.
//
// Routes:
//     - GET /: Returns a simple "OK" response.
//     - GET /health: Returns a simple "OK" response for health checks.
//
//     - /auth/* routes for authentication.
//     - /event/* routes for events.
func SetupHomeRoutes(r *gin.Engine) {
    homeGroup := r.Group("/")

	homeGroup.GET("/", home)
	homeGroup.GET("/health", health)

	auth.NewAuthUserHandler(repository.UserRepo).RegisterRoutes(homeGroup)
	event.NewEventHandler(repository.EventRepo).RegisterRoutes(homeGroup)
}

// path: GET /
// description: Home route that returns a simple "OK" response.
func home(c *gin.Context) {
	c.String(http.StatusOK, "OK")
}

// path: GET /health
// description: Health route that returns a simple "OK" response.
func health(c *gin.Context) {
	c.String(http.StatusOK, "OK")
}