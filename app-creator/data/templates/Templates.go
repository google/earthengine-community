package templates_data 

import (
	"encoding/json"
	"io"
	"context"
	"cloud.google.com/go/datastore"
	"log"
)

type Template struct {
	Id string `json:"id"` 
	Name string `json:"name"`
	ImageUrl string `json:"imageUrl"`
	Template string `json:"template"`
}

type Templates []*Template

/**
* Converts an array of Template data into JSON.
*/
func (t *Templates) ToJSON(w io.Writer) error {
	encoder := json.NewEncoder(w)
	return encoder.Encode(t)
}

/**
* Converts a JSON representation of a Template object into a Template instance. 
*/
func (t *Template) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(t)
}

/**
* Returns array of templates.
*/
func GetTemplates(db *datastore.Client, l *log.Logger, ctx context.Context) Templates {
	templates := []*Template{}
	_, err := db.GetAll(ctx, datastore.NewQuery("Template"), &templates)
	if err != nil {
		l.Fatal("Unable to fetch templates\n")
	}

	return templates
}

// TODO: Implement adding templates to the database. Used when a user saves a template.
func AddTemplate(t *Template) {} 
