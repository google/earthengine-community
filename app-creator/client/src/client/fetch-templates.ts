/**
 *  @fileoverview This file acts as a mock database storing our templates.
 */
export interface TemplateItem {
  id: string;
  name: string;
  imageUrl: string;
  template: string;
}

/**
 * Placeholder database. This data will be stored on Datastore and will be fetched from an API endpoint.
 */
export const database: TemplateItem[] = [
  {
    id: 'left-side-panel',
    name: 'Left Side Panel',
    imageUrl:
      'https://storage.cloud.google.com/ee-app-creator.appspot.com/left-panel.png',
    template: `{
        "config": {
            "parentID": "left-side-panel",
            "parentName": "Left Side Panel",
            "id": "left-side-panel-desktop",
            "name": "Left Side Panel Desktop",
            "textDirection": "left",
            "language": "en"
        },
        "widgets": {
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
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity": "100",
                    "shown": "true",
                    "boxSizing": "border-box"
                }
            },
            "panel-template-1": {
                "id": "panel-template-1",
                "editable": true,
                "hasDropzone": true,
                "children": ["label-template-0", "label-template-1", "button-template-0"],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "100%",
                    "width": "40%",
                    "padding": "8px",
                    "margin": "0px",
                    "backgroundColor": "#dfd2aeFF",
                    "backgroundOpacity": "100",
                    "borderWidth": "5px",
                    "borderColor": "#e28b59",
                    "boxSizing": "border-box"
                }
            },
            "map-template-0": {
                "id": "map-template-0",
                "children": [],
                "uniqueAttributes": {
                    "zoom": "10",
                    "latitude": "37.419857",
                    "longitude": "-122.078827",
                    "zoomControl": "false",
                    "fullscreenControl": "false",
                    "scaleControl": "false",
                    "streetViewControl": "false",
                    "mapTypeControl": "false",
                    "mapStyles": "retro",
                    "customMapStyles": ""
                },
                "style": {
                    "height": "100%",
                    "width": "60%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity": "100",
                    "boxSizing": "border-box"
                }
            },
            "label-template-0": {
                "id": "label-template-0",
                "children": [],
                "uniqueAttributes": {
                    "value": "Earth Engine",
                    "targetUrl": ""
                },
                "style": {
                    "backgroundColor": "#FFFFFF00",
                    "backgroundOpacity": "0",
                    "fontSize": "32px",
                    "fontWeight": "700"
                }
            },
            "label-template-1": {
                "id": "label-template-1",
                "children": [],
                "uniqueAttributes": {
                    "value": "Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth\'s surface.",
                    "targetUrl": ""
                },
                "style": {
                    "backgroundColor": "#FFFFFF00",
                    "fontSize": "14px"
                }
            },
            "button-template-0": {
                "id": "button-template-0",
                "children": [],
                "uniqueAttributes": {
                    "label": "Button",
                    "disabled": "false"
                },
                "style": {
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity": "100"
                }
            }
        }
    }`,
  },
];
