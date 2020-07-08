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
	"cloud.google.com/go/datastore"
	"modules/handlers/templates"
)

func main() {
	/**
	* Getting application context.
	*/
	ctx := context.Background()

	/** 
	* Creating a datastore client. This instance is shared across the application.
	*/
	db, err := datastore.NewClient(ctx, os.Getenv("GOOGLE_CLOUD_PROJECT"))
	if err != nil {
		log.Fatal("Database connection error", err)
	}

	/**
	* Creating shared logger instance.
	*/
	l := log.New(os.Stdout, "app-creator", log.LstdFlags)

	/**
	* Check if a PORT env variable is set.
	*/
	port := os.Getenv("PORT")

	/**
	* Strip any leading colons and make sure it only contains numbers.
	*/
	re := regexp.MustCompile(`^[:]([0-9]+)$`)
	
	/**
	* Default to port 8080 if environment variable is not set or is invalid.
	*/
	if port == "" || !re.MatchString(port) {
		port = ":8080"
		log.Printf("Defaulting to port %s", port)
	}
	
	/**
	* Initializing a new server mux to handle routes.
	*/
	serverMux := http.NewServeMux()
	
	/**
	* Serving static files.
	*/
	fs := http.FileServer(http.Dir("./static"))
	serverMux.Handle("/", fs)
	serverMux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	
	/**
	* Setting up handlers.
	*/
	templatesHandler := handlers.NewTemplatesHandler(l, db)

	/**
	* Registering handlers.
	*/
	serverMux.Handle("/api/v1/templates", templatesHandler)

	/**
	* CORS middleware. Default option allows all origins. 
	* https://github.com/rs/cors
	*/ 
	c := cors.Default().Handler(serverMux)

	/**
	* Setting up server instance.
	*/
	server := &http.Server{
		Addr:         port,
		Handler:      c,
		IdleTimeout:  120 * time.Second,
		ReadTimeout:  1 * time.Second,
		WriteTimeout: 1 * time.Second,
	}

	/**
	* Start server on a new thread. This is a blocking operation
	* so we need to run it in the background.
	*/
	go func() {
		err := server.ListenAndServe()
		if err != nil {
			l.Fatal(err)
		}
	}()

	/**
	* Handle termination gracefully by listening to Interrupt and Kill signals
	* and waiting 30 seconds to make sure any handlers being executed get to
	* complete in time.
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
