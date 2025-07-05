package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type EnvVariables struct {
	Port                string
	DatabaseUrl         string
	AllowedOrigins      string
	GoogleClientID      string
	GoogleClientSecret  string
	JWTSecretKey        string
	SelfOrigin          string
	RedirectURL			string
}

var Env *EnvVariables

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}

	return fallback
}

func LoadEnvVariables(filenames ...string) {
	// Load environment variables from .env file if it exists
	if err := godotenv.Load(filenames...); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	Env = &EnvVariables{
		Port                  : getenv("PORT", "8080"),
		DatabaseUrl           : getenv("DATABASE_URL", "/tmp/local.db"),
		AllowedOrigins        : getenv("ALLOW_ORIGINS", "https://eventify.tanishqsingh.com,http://localhost:5173"),
		GoogleClientID        : getenv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret    : getenv("GOOGLE_CLIENT_SECRET", ""),
		JWTSecretKey          : getenv("JWT_SECRET", ""),
		SelfOrigin            : getenv("SELF_ORIGIN", fmt.Sprintf("http://localhost:%s", getenv("PORT", "8080"))),
		RedirectURL		      : getenv("REDIRECT_URL", fmt.Sprintf("http://localhost:%s/auth/protected", getenv("PORT", "8080"))),
	}
}