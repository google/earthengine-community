package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

func main() {
	/**
	* Creating shared logger instance.
	 */
	l := log.New(os.Stdout, "app-creator", log.LstdFlags)

	/**
	* Setting up handlers.
	 */
	indexHandler := handlers.NewIndexHandler(l)

	/**
	* Registering handlers with a new server mux.
	 */
	serverMux := http.NewServeMux()
	serverMux.Handle("/", indexHandler)

	/**
	* Setting up server instance.
	 */
	server := &http.Server{
		Addr:         ":8080",
		Handler:      serverMux,
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
	l.Println("Shutting down gracefully")

	timeoutContext, _ := context.WithTimeout(context.Background(), 30*time.Second)
	server.Shutdown(timeoutContext)
}
