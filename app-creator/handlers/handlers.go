package handlers

import (
	"log"
	"net/http"
	"modules/data"
	"github.com/googleapis/google-cloud-go-testing/datastore/dsiface"
)

/*
 TemplatesHandler define the structure of a templates handler instance.
*/
type TemplatesHandler struct {
	l *log.Logger 
	db dsiface.Client
}

/*
 New creates a new templates handler with a provided logger instance.
*/
func New(l *log.Logger, db dsiface.Client) *TemplatesHandler {
	return &TemplatesHandler{l, db}
}

/*
 ServeHTTP is the handler called on requests made to "/templates".
*/
func (t *TemplatesHandler) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	switch r.Method {
		case http.MethodGet:
			t.getTemplates(rw, r)
			return
		case http.MethodPost:
			t.addTemplate(rw, r)
			return
	}

	// Return method-not-allowed status for non-implemented methods.
	rw.WriteHeader(http.StatusMethodNotAllowed)
}

/*
 getTemplates is a helper method called on GET requests to "/templates".
*/
func (t *TemplatesHandler) getTemplates(rw http.ResponseWriter, r *http.Request) {
	templates, err := data.Get(r.Context(), t.db, t.l)
	if err != nil {
		http.Error(rw, "Unable to fetch templates from database.", http.StatusInternalServerError)
	}

	err = templates.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Conversion to JSON was unsuccessful.", http.StatusInternalServerError)
	}
}

/*
 addTemplate is a helper method called on POST requests to "/templates". 
 Adds a new template to the database.
*/
func (t *TemplatesHandler) addTemplate(rw http.ResponseWriter, r *http.Request) {
	template := &data.Template{}
	err := template.FromJSON(r.Body)
	if err != nil {
		http.Error(rw, "Failed JSON conversion.", http.StatusInternalServerError)
	}

	err = data.AddTemplate(template)
	if err != nil {
		http.Error(rw, "Failed to add template.", http.StatusInternalServerError)
	}

	t.l.Printf("Template added successfully to datastore: %#v", template)
}

