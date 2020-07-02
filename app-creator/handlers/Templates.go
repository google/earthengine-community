package handlers

import (
	"log"
	"net/http"
	"modules/data"
)

type Templates struct {
	l *log.Logger 
}

/**
* Creates new templates handler with a provided logger instance.
*/
func NewTemplatesHandler(l *log.Logger) *Templates {
	return &Templates{l}
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
	templates := data.GetTemplates()
	err := templates.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Unable to fetch templates", http.StatusInternalServerError)
	}
}

/*
* Helper method called on POST requests to "/templates". Adds a new template to the database.
*/
func (t *Templates) addTemplate(rw http.ResponseWriter, r *http.Request) {
	t.l.Println("Handle adding template")
	template := &data.Template{}
	err := template.FromJSON(r.Body)
	if err != nil {
		http.Error(rw, "Failed JSON conversion", http.StatusBadRequest)
	}

	t.l.Printf("Template: %#v", template)
	data.AddTemplate(template)
}