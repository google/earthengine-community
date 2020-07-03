package handlers

import (
	"log"
	"net/http"
	data "modules/data/templates"
	"cloud.google.com/go/datastore"
)

type Templates struct {
	l *log.Logger 
	db *datastore.Client
}

/**
* Creates new templates handler with a provided logger instance.
*/
func NewTemplatesHandler(l *log.Logger, db *datastore.Client) *Templates {
	return &Templates{l, db}
}

/*
* Handler called on requests made to "/templates".
*/
func (t *Templates) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		t.getTemplates(rw, r)
		return
	}

	if r.Method == http.MethodPost {
		t.addTemplate(rw, r)
		return
	}

	// Return method-not-allowed status for non-implemented methods.
	rw.WriteHeader(http.StatusMethodNotAllowed)
}

/*
* Helper method called on GET requests to "/templates".
*/
func (t *Templates) getTemplates(rw http.ResponseWriter, r *http.Request) {
	templates := data.GetTemplates(t.db, t.l, r.Context())
	err := templates.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Conversion to JSON was unsuccessful", http.StatusInternalServerError)
	}
}

/*
* Helper method called on POST requests to "/templates". Adds a new template to the database.
*/
func (t *Templates) addTemplate(rw http.ResponseWriter, r *http.Request) {
	template := &data.Template{}
	err := template.FromJSON(r.Body)
	if err != nil {
		http.Error(rw, "Failed JSON conversion", http.StatusBadRequest)
	}

	t.l.Printf("Template: %#v", template)
	data.AddTemplate(template)
}