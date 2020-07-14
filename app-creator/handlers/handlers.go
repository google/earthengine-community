package handlers

import (
	"log"
	"net/http"
	"modules/data"
	"github.com/googleapis/google-cloud-go-testing/datastore/dsiface"
)

/*
 Templates define the structure of a templates handler instance.
*/
type Templates struct {
	l *log.Logger 
	db dsiface.Client
}

/*
 NewHandler creates a new templates handler with a provided logger instance.
*/
func NewHandler(l *log.Logger, db dsiface.Client) *Templates {
	return &Templates{l, db}
}

/*
 ServeHTTP is the handler called on requests made to "/templates".
*/
func (t *Templates) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
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
func (t *Templates) getTemplates(rw http.ResponseWriter, r *http.Request) {
	templates := data.Get(r.Context(), t.db, t.l)
	err := templates.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Conversion to JSON was unsuccessful", http.StatusInternalServerError)
	}
}

/*
 addTemplate is a helper method called on POST requests to "/templates". 
 Adds a new template to the database.
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

