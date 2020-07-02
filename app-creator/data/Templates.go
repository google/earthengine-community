package data 

import (
	"encoding/json"
	"io"
)

type Template struct {
	Id string `json:"id"` 
	Name string `json:"name"`
	ImageUrl string `json:"description"`
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
func GetTemplates() Templates {
	return templates
}

/**
* Adds a new template to the global template array.
*/
func AddTemplate(t *Template) {
	templates = append(templates, t)
} 

var templates = []*Template{
	&Template{
		Id: "left-side-panel",
		Name: "Left Side Panel",
		ImageUrl: "https://storage.googleapis.com/ee-app-creator.appspot.com/left-side-panel.jpeg",
		Template: `{
			"id": "left-side-panel",
			"name": "Left Side Panel",
			"panel-template-0": {
				"id": "panel-template-0",
				"editable": false,
				"hasDropzone": false,
				"children": ["panel-template-1", "map-template-0"],
				"uniqueAttributes": {
					"layout": "row"
				},
				"style": {
					"height": "100%",
					"width": "100%",
					"padding": "0px",
					"margin": "0px",
					"color": "black",
					"backgroundColor": "#FFFFFF",
					"borderWidth": "0px",
					"borderStyle": "solid",
					"borderColor": "black",
					"fontSize": "12px",
					"fontWeight": "300",
					"fontFamily": "Roboto",
					"textAlign": "left",
					"whiteSpace": "normal",
					"shown": "true",
					"box-sizing": "border-box"
				}
			},
			"panel-template-1": {
				"id": "panel-template-1",
				"editable": true,
				"hasDropzone": true,
				"children": [],
				"uniqueAttributes": {
					"layout": "column"
				},
				"style": {
					"height": "100%",
					"width": "40%",
					"padding": "0px",
					"margin": "0px",
					"color": "black",
					"backgroundColor": "#FFFFFF",
					"borderWidth": "0px",
					"borderStyle": "solid",
					"borderColor": "black",
					"fontSize": "12px",
					"fontWeight": "300",
					"fontFamily": "Roboto",
					"textAlign": "left",
					"whiteSpace": "normal",
					"shown": "true",
					"box-sizing": "border-box"
				}
			},
			"map-template-0": {
				"id": "map-template-0",
				"children": [],
				"uniqueAttributes": {
					"zoom": "4",
					"latitude": "37.419857",
					"longitude": "-122.078827",
					"zoomControl": "false",
					"fullscreenControl": "false",
					"scaleControl": "false",
					"streetViewControl": "false",
					"mapTypeControl": "false",
					"mapStyles": "standard",
					"customMapStyles": ""
				}, "style": {
					"height": "100%",
					"width": "60%",
					"padding": "0px",
					"margin": "0px",
					"color": "black",
					"backgroundColor": "#FFFFFF",
					"borderWidth": "0px",
					"borderStyle": "solid",
					"borderColor": "black",
					"fontSize": "12px",
					"fontWeight": "300",
					"fontFamily": "Roboto",
					"textAlign": "left",
					"whiteSpace": "normal",
					"shown": "true",
					"box-sizing": "border-box"
				}
			}
		}`}}