package auth

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/markbates/goth"
	"github.com/markbates/goth/providers/google"
	"github.com/shuklashikhar007/Eventify/backend/internal/config"
	"github.com/shuklashikhar007/Eventify/backend/internal/helpers"
	"github.com/shuklashikhar007/Eventify/backend/internal/middleware"
	"github.com/shuklashikhar007/Eventify/backend/internal/models"
	"github.com/shuklashikhar007/Eventify/backend/internal/repository"
)

type AuthUserHandler struct{
	userRepo *repository.UserRepository
}

func NewAuthUserHandler(userRepo *repository.UserRepository) *AuthUserHandler {
	goth.UseProviders(
        google.New(
            config.Env.GoogleClientID,
            config.Env.GoogleClientSecret,
            fmt.Sprintf("%s/auth/google/callback", config.Env.SelfOrigin),
            "email", "profile",
        ),
    )
	
	return &AuthUserHandler{
		userRepo,
	}
}

// RegisterRoutes initializes the auth routes for the application.
//
// Routes:
//     - GET /auth/: Returns a simple "OK" response.
//
//     - /auth/user/*
//         - GET /auth/user: Get user by ID (requires authentication)
//         - GET /auth/user/logout: Logout user
//         - DELETE /auth/user: Delete user by ID (requires authentication)
//
//     - /auth/google/*
//         - GET /auth/google/authorize: OAuth2 authorization endpoint for third-party providers
//         - GET /auth/google/callback: OAuth2 callback endpoint for third-party providers (register / login)
func (h *AuthUserHandler) RegisterRoutes(r *gin.RouterGroup) {
	authUserGroup := r.Group("/auth")

	authUserGroup.GET("/", h.Home)
	authUserGroup.GET("/protected", middleware.UserAuthMiddleware, h.ProtectedRoute)

	// --------- USER SERVICES (get user, delete user, logout, add login method, remove login method) ---------
	authUserGroup.GET("/user", middleware.UserAuthMiddleware, h.GetUserByID)
	authUserGroup.GET("/user/logout", h.Logout)
	authUserGroup.DELETE("/user", middleware.UserAuthMiddleware, h.DeleteUserByID)

	// --------- AUTH USER SERVICES (register, login with third party providers e.g google, github, etc) ---------
	authUserGroup.GET("/google/authorize", h.OAuthAuthorize)
	authUserGroup.GET("/google/callback", h.OAuthCallback)
}

// ----------------------------- User Handlers -----------------------------

// path: GET /auth
// description: Home route that returns a simple "OK" response.
func (h *AuthUserHandler) Home(c *gin.Context) {
	c.String(http.StatusOK, "OK")
}

func (h *AuthUserHandler) ProtectedRoute(c *gin.Context) {
	c.String(http.StatusOK, "OK")
}

// path: GET /auth/user
// description: Get user by ID (requires authentication)
func (h *AuthUserHandler) GetUserByID(c *gin.Context) {
	rawUser, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	user := rawUser.(models.User)

	user, err := h.userRepo.GetById(user.ID)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{ "error": fmt.Sprintf("User not found: %s", user.ID) })
		return
	}

	c.JSON(http.StatusOK, gin.H{ "user": user })
}

// path: GET /auth/user/logout
// description: Logout user by clearing cookies
func (h *AuthUserHandler) Logout(c *gin.Context) {
	helpers.ExpireCookie(c, "token") // expire the token cookie
	helpers.ExpireCookie(c, "oauth_state") // expire the oauth state cookie
	helpers.ExpireCookie(c, "oauth_session") // expire the oauth session cookie

	c.Redirect(http.StatusTemporaryRedirect, config.Env.RedirectURL)
}

// path: GET /auth/user
// description: Delete user (requires authentication)
func (h *AuthUserHandler) DeleteUserByID(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	uid := user.(models.User).ID

	_, err := h.userRepo.DeleteUser(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{ "error": err.Error() })
		return
	}

	c.JSON(http.StatusOK, gin.H{ "message": "User deleted ID: " + uid })
}

// ----------------------------- Oauth2 Authentication Handlers -----------------------------

const (
	stateCookie   = "oauth_state"
	sessionCookie = "oauth_session"
	cookieMaxAge  = 4 * 60 // 4 min – long enough to complete auth
)

// path: GET /auth/google/authorize
// description: OAuth2 authorization endpoint for google providers.
func (h *AuthUserHandler) OAuthAuthorize(c *gin.Context) {
    provider, err := goth.GetProvider("google")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported provider"})
        return
    }

	state := uuid.New().String()
    sess, err := provider.BeginAuth(state)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

	raw := sess.Marshal() // never returns error

	helpers.SetCookie(c, stateCookie, state, cookieMaxAge)
	helpers.SetCookie(c, sessionCookie, raw, cookieMaxAge)

    url, err := sess.GetAuthURL()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.Redirect(http.StatusTemporaryRedirect, url)
}

// path: GET /auth/google/callback
// description: Generaste a token for the user who login through google providers (register / login user).
func (h *AuthUserHandler) OAuthCallback(c *gin.Context) {
    provider, err := goth.GetProvider("google")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported provider"})
        return
    }

	queryState := c.Query("state")
	savedState, _ := c.Cookie(stateCookie)

	if queryState == "" || savedState != queryState {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid state"})
		return
	}

	rawSession, err := c.Cookie(sessionCookie)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing session"})
		return
	}

	sess, _ := provider.UnmarshalSession(rawSession)
	if _, err := sess.Authorize(provider, c.Request.URL.Query()); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    userData, err := provider.FetchUser(sess)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	user.ProviderID = userData.UserID
	user.Email = userData.Email
	user.Name = userData.Name
	user.ImageURL = userData.AvatarURL

	// there are two college email id's provided by
	// Indidan Institute of Technology (BHU) Varanasi
	email := user.Email
	isCollegeId1 := strings.HasSuffix(email, "@itbhu.ac.in")
	isCollegeId2 := strings.HasSuffix(email, "@iitbhu.ac.in")

	if !isCollegeId1 && !isCollegeId2 {
		redirect_url := fmt.Sprintf("%s/message/only @itbhu.ac.in or @iitbhu.ac.in email id valid.", config.Env.RedirectURL)
		c.Redirect(http.StatusTemporaryRedirect, redirect_url)
		return
	}

	token, err := h.userRepo.CreateNewUserOrToken(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	helpers.ExpireCookie(c, stateCookie) // expire the state cookie
	helpers.ExpireCookie(c, sessionCookie) // expire the session cookie

	c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("%s/save-token/%s", config.Env.RedirectURL, token))
}