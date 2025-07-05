package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mitchellh/mapstructure"
	"github.com/shuklashikhar007/Eventify/backend/internal/helpers"
	"github.com/shuklashikhar007/Eventify/backend/internal/models"
)

// AuthMiddleware validates JWT token and sets user in context
func UserAuthMiddleware(c *gin.Context) {
	if c.Request.Method == "OPTIONS" {
        c.Next()
        return
    }

    cookie, err := c.Request.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Authorization Header"})
		return
	}

	claims, err := helpers.VerifyToken(cookie.Value)
	if err != nil {
		if err.Error() == "token has invalid claims: token is expired" {
			c.Redirect(http.StatusFound, "/auth/google/authorize")
			return
		}

		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	mapstructure.Decode(claims["user"], &user)

	c.Set("user", user)
    c.Next()
}