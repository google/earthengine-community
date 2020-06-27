package main

import (
	"log"
	"os"
	"regexp"

	"github.com/labstack/echo"
)

func main() {
	// Creating echo object.
	e := echo.New()

	// Setting static directory.
	e.Static("/static", "static")

	// Serving index.html on "/" route.
	e.File("/", "static/index.html")

	// Check if a PORT env variable is set.
	port := os.Getenv("PORT")

	// Strip any leading leading colons and make sure it only contains numbers.
	re := regexp.MustCompile(`^[:]+?([0-9]+)$`)
	port = string(re.ReplaceAll([]byte(port), []byte("$1"))[:])

	reAllNumbers := regexp.MustCompile(`^[0-9]+$`)

	// Default to port 8080 if environment variable is not set or is invalid.
	if port == "" || !reAllNumbers.MatchString(port) {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}

	// Starting server.
	log.Printf("Listening on port %s", port)
	e.Logger.Fatal(e.Start(":" + port))
}
