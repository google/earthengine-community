package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
	"regexp"
	"github.com/rs/cors"
	"modules/handlers"
	"cloud.google.com/go/datastore"
	"strings"
	"github.com/googleapis/google-cloud-go-testing/datastore/dsiface"
)

func main() {
	/*
	  Getting application context.
	*/
	ctx := context.Background()

	/* 
	  Creating a datastore client. This instance is shared across the application.
	*/
	db, err := datastore.NewClient(ctx, os.Getenv("GOOGLE_CLOUD_PROJECT"))
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}

	/*
	  Create an adapter around the datastore client. The adapter allows us to 
	  switch between the real datastore client instance and the mock instance for testing.
	*/
	dbclient := dsiface.AdaptClient(db);

	/*
	  Creating shared logger instance.
	*/
	l := log.New(os.Stdout, "app-creator", log.LstdFlags)

	/*
	  Check if a PORT env variable is set.
	*/
	port := os.Getenv("PORT")

	/*
	  Strip any leading colons and make sure it only contains numbers.
	*/
	re := regexp.MustCompile(`^:?([0-9]+)$`)
	
	/*
	  Default to port 8080 if environment variable is not set or is invalid.
	*/
	if port == "" || !re.MatchString(port) {
		invalidPort := port;
		port = ":8080"
		log.Printf("Invalid port number. Received: '%s'. Defaulting to port %s", invalidPort, port)
	}
	
	/*
	  Initializing a new server mux to handle routes.
	*/
	serverMux := http.NewServeMux()
	
	/*
	  Serving static files.
	*/
	fs := http.FileServer(http.Dir("./static"))
	serverMux.Handle("/", fs)
	serverMux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	
	/*
	  Setting up handlers.
	*/
	handler := handlers.New(l, dbclient)

	/*
	  Registering handlers.
	*/
	serverMux.Handle("/api/v1/templates", handler)

	/*
	  CORS middleware. Default option allows all origins. 
	  https://github.com/rs/cors
	  ch - cors handler
	*/ 
	c := cors.Default().Handler(serverMux)

	// If env variable is set for allowedOrigins, use them instead of the default.
	// Split comma separated domains and trim whitespaces.
	allowedOrigins := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")
	for i, o := range allowedOrigins {
		allowedOrigins[i] = strings.Trim(o, " ")
	}

	if len(allowedOrigins) > 0 {
		c = cors.New(cors.Options{
			AllowedOrigins: allowedOrigins,
			AllowCredentials: true,
		}).Handler(serverMux)
	}

	/*
	  Setting up server instance.
	*/
	server := &http.Server{
		Addr:         port,
		Handler:      c,
		IdleTimeout:  120 * time.Second,
		ReadTimeout:  1 * time.Second,
		WriteTimeout: 1 * time.Second,
	}

	/*
	  Start server on a new thread. This is a blocking operation
	  so we need to run it in the background.
	*/
	go func() {
		err := server.ListenAndServe()
		if err != nil {
			l.Fatal(err)
		}
	}()

	/*
	  Handle termination gracefully by listening to Interrupt and Kill signals
	  and waiting 30 seconds to make sure any handlers being executed get to
	  complete in time.
	*/
	sigChan := make(chan os.Signal)
	signal.Notify(sigChan, os.Interrupt)
	signal.Notify(sigChan, os.Kill)

	sig := <-sigChan
	l.Println("Shutting down gracefully", sig)

	timeoutContext, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	server.Shutdown(timeoutContext)
}
