package data

import (
	"encoding/json"
	"io"
	"context"
	"log"
	"cloud.google.com/go/datastore"
	"github.com/googleapis/google-cloud-go-testing/datastore/dsiface"
)

/*
 Template struct defines the structure of template objects in our database.
*/
type Template struct {
	Id string `json:"id"` 
	Name string `json:"name"`
	ImageURL string `json:"imageURL"`
	Template string `json:"template"`
}

/*
 Templates is an array data type for templates. Used when fetching templates and returning them to the user.
*/
type Templates []*Template

/**
 ToJSON is a method called on a Templates. It converts an array of Template data into JSON.
*/
func (t *Templates) ToJSON(w io.Writer) error {
	encoder := json.NewEncoder(w)
	return encoder.Encode(t)
}

/**
 FromJSON converts a JSON representation of a Template object into a Template instance. 
*/
func (t *Template) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(t)
}

/**
 Get is used to fetch templates from the database and returns a slice of templates.
*/
func Get(ctx context.Context, db dsiface.Client, l *log.Logger) (Templates, error) {
	templates := []*Template{}
	_, err := db.GetAll(ctx, datastore.NewQuery("Template"), &templates)

	return templates, err
}

// TODO: Implement adding templates to the database. Used when a user saves a template.
func AddTemplate(t *Template) error {
	return nil
} 
