package templates_data

import (
	"testing"
	"net/http/httptest"
	"io/ioutil"
	"net/http"
	"encoding/json"
	"strings"
)

func TestToJSON(t *testing.T) {
	rec := httptest.NewRecorder()

	err := templates.ToJSON(rec)
	if err != nil {
		t.Fatalf("error converting to json: %v", err)
	}

	res := rec.Result()
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status OK; got %v", res.StatusCode)
	}

	_, err = ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf("could not read response: %v", err)
	}
}

func TestFromJSON(t *testing.T) {
	template := templates[0]

	templateJSON, err := json.Marshal(template)
	if err != nil {
		t.Fatalf("could not convert template to json: %v", err)
	}

	r := strings.NewReader(string(templateJSON))
	req, err := http.NewRequest("GET", "localhost:8080/api/v1/templates", r)
	if err != nil {
		t.Fatalf("could not create request: %v", err)
	}

	err = template.FromJSON(req.Body)
	if err != nil {
		t.Fatalf("error converting from json: %v", err)
	}
}

var templates = Templates{
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
		}`,
	},
}
