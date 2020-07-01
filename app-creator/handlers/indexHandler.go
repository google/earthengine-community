package handlers

import (
	"log"
	"net/http"
)

type IndexHandler struct {
	l *log.Logger
}

func NewIndexHandler(l *log.Logger) *IndexHandler {
	return &IndexHandler{l}
}

func (ih *IndexHandler) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	// serve static files
	rw.Write([]byte("index Handler"))
}
