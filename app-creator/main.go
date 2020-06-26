package main

import (
	"log"
	"os"

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
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}

	// Starting server.
	log.Printf("Listening on port %s", port)
	e.Logger.Fatal(e.Start(":" + port))
}
