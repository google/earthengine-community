import { DeviceType } from '../redux/types/enums';

/**
 *  @fileoverview This file acts as a mock database storing our templates.
 */
export interface TemplateItem {
  id: string;
  name: string;
  imageUrl: string;
  device: DeviceType;
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
    device: DeviceType.desktop,
    template: `{
        "config": {
            "parentID": "left-side-panel",
            "parentName": "Left Side Panel",
            "id": "left-side-panel-desktop",
            "name": "Left Side Panel Desktop",
            "textDirection": "left",
            "language": "en",
            "device": "desktop"
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
  {
    id: 'left-drawer-mobile',
    name: 'Left Drawer Mobile',
    imageUrl:
      'https://storage.googleapis.com/ee-app-creator.appspot.com/left-drawer-mobile.png',
    device: DeviceType.mobile,
    template: `{
        "config": {
            "parentID": "left-drawer-mobile",
            "parentName": "Left Drawer Mobile",
            "id": "left-drawer-mobile",
            "name": "Left Side Panel Mobile",
            "textDirection": "left",
            "language": "en",
            "device": "mobile"
        },
        "widgets": {
            "panel-template-0": {
                "id": "panel-template-0",
                "editable": false,
                "hasDropzone": false,
                "children": ["map-template-0", "sidemenu-template-0"],
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
                    "box-sizing": "border-box"
                }
            },
            "sidemenu-template-0": {
                "id": "sidemenu-template-0",
                "editable": true,
                "hasDropzone": true,
                "children": [
                    "label-template-0",
                    "label-template-1",
                    "button-template-0"
                ],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "100%",
                    "width": "80%",
                    "padding": "0px",
                    "margin": "0px",
                    "color": "black",
                    "backgroundOpacity": "100",
                    "backgroundColor": "#FFFFFF00",
                    "box-sizing": "border-box",
                    "position": "absolute",
                    "top":0,
                    "left":0
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
                   "fontSize": "32px",
                   "fontWeight": "700"
                }
             },
             "label-template-1": {
                "id": "label-template-1",
                "children": [],
                "uniqueAttributes": {
                   "value": "Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth's surface.",
                   "targetUrl": ""
                },
                "style": {
                   "backgroundColor": "#FFFFFF00"
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
                   "backgroundColor": "#FFFFFF00"
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
                },
                "style": {
                    "height": "100%",
                    "width": "100%",
                    "padding": "0px",
                    "margin": "0px",
                    "color": "black",
                    "backgroundColor": "#FFFFFF",
                    "box-sizing": "border-box"
                }
            }
        }
    }`,
  },
  {
    id: 'right-side-panel',
    name: 'Right Side Panel',
    imageUrl:
      'https://storage.cloud.google.com/ee-app-creator.appspot.com/right-panel.png',
    device: DeviceType.desktop,
    template: `{
        "config": {
            "parentID": "right-side-panel",
            "parentName": "Right Side Panel",
            "id": "right-side-panel-desktop",
            "name": "Right Side Panel Desktop",
            "textDirection": "left",
            "language": "en",
            "device": "desktop"
        },
        "widgets": {
            "panel-template-0": {
                "id": "panel-template-0",
                "editable": false,
                "hasDropzone": false,
                "children": ["map-template-0", "panel-template-1"],
                "uniqueAttributes": {
                    "layout": "row"
                },
                "style": {
                    "height": "100%",
                    "width": "100%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity": "100",
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
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity": "100",
                    "boxSizing": "border-box"
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
                    "mapStyles": "silver",
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
                    "margin": "8px",
                    "backgroundColor": "#FFFFFF00",
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
                    "margin": "8px",
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
                    "margin": "8px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity": "100"
                }
            }
        }
    }`,
  },
  {
    id: 'map-with-legend',
    name: 'Map With Legend',
    imageUrl:
      'https://storage.cloud.google.com/ee-app-creator.appspot.com/legend-example.png',
    device: DeviceType.desktop,
    template: `{
        "config": {
            "parentID": "map-with-legend",
            "parentName": "Map with legend",
            "id": "map-with-legend-desktop",
            "name": "Map with legend Desktop",
            "textDirection": "left",
            "language": "en",
            "device": "desktop"
        },
        "widgets": {
            "panel-template-0": {
                "id": "panel-template-0",
                "editable": false,
                "hasDropzone": false,
                "children": ["map-template-0"],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "100%",
                    "width": "100%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFF",
                    "backgroundOpacity": "100",
                    "position": "relative",
                    "boxSizing": "border-box"
                }
            },
            "panel-template-1": {
                "id": "panel-template-1",
                "editable": true,
                "hasDropzone": true,
                "children": ["label-template-1", "label-template-0", "button-template-0"],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "300px",
                    "width": "500px",
                    "padding": "16px",
                    "margin": "0px",
                    "backgroundColor": "#0e1626CC",
                    "backgroundOpacity": "80",
                    "borderWidth": "5px",
                    "borderStyle": "solid",
                    "borderColor": "#85b7b0",
                    "position": "absolute",
                    "bottom": "32px",
                    "left": "16px",
                    "boxSizing": "border-box"
                }
            },
            "map-template-0": {
                "id": "map-template-0",
                "children": ["panel-template-1"],
                "uniqueAttributes": {
                    "zoom": "4",
                    "latitude": "37.419857",
                    "longitude": "-122.078827",
                    "zoomControl": "false",
                    "fullscreenControl": "false",
                    "scaleControl": "false",
                    "streetViewControl": "false",
                    "mapTypeControl": "false",
                    "mapStyles": "aubergine",
                    "customMapStyles": ""
                },
                "style": {
                    "height": "100%",
                    "width": "100%",
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
                    "value": "Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the surface of the earth.",
                    "targetUrl": ""
                },
                "style": {
                    "margin": "8px",
                    "color": "#ffffff",
                    "backgroundColor": "#FFFFFF00",
                    "backgroundOpacity": "0px",
                    "fontSize": "16px"
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
                    "margin": "8px",
                    "backgroundColor": "#FFFFFF",
                    "backgroundOpacity": "0px"
                }
            },
            "label-template-1": {
                "id": "label-template-1",
                "children": [],
                "uniqueAttributes": {
                    "value": "Earth Engine",
                    "targetUrl": ""
                },
                "style": {
                    "margin": "8px",
                    "color": "#ffffff",
                    "backgroundColor": "#FFFFFF00",
                    "backgroundOpacity": "0px",
                    "fontSize": "32px",
                    "fontWeight": "700"
                }
            }
        }
    }`,
  },
  {
    id: 'two-maps',
    name: 'Two Maps',
    imageUrl:
      'https://storage.cloud.google.com/ee-app-creator.appspot.com/two-map.png',
    device: DeviceType.desktop,
    template: `{
        "config": {
            "parentID": "two-maps",
            "parentName": "Two Maps",
            "id": "two-maps-desktop",
            "name": "Two Maps Desktop",
            "textDirection": "left",
            "language": "en",
            "device": "desktop"
        },
        "widgets": {
            "panel-template-0": {
                "id": "panel-template-0",
                "editable": false,
                "hasDropzone": false,
                "children": ["map-template-0", "map-template-1"],
                "uniqueAttributes": {
                    "layout": "row"
                },
                "style": {
                    "height": "100%",
                    "width": "100%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity": "100",
                    "position": "relative",
                    "boxSizing": "border-box"
                }
            },
            "panel-template-1": {
                "id": "panel-template-1",
                "editable": true,
                "hasDropzone": true,
                "children": ["label-template-3", "label-template-2", "button-template-0"],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "350px",
                    "width": "300px",
                    "padding": "16px",
                    "margin": "0px",
                    "backgroundColor": "#17263CF2",
                    "backgroundOpacity": "95",
                    "borderWidth": "5px",
                    "borderStyle": "solid",
                    "borderColor": "#dfd2ae",
                    "position": "absolute",
                    "top": "16px",
                    "left": "16px",
                    "boxSizing": "border-box",
                    "zIndex": "1"
                }
            },
            "panel-template-2": {
                "id": "panel-template-2",
                "editable": true,
                "hasDropzone": true,
                "children": ["label-template-4", "label-template-0", "button-template-1"],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "350px",
                    "width": "300px",
                    "padding": "16px",
                    "margin": "0px",
                    "backgroundColor": "#DFD2AEF2",
                    "backgroundOpacity": "95",
                    "borderWidth": "5px",
                    "borderStyle": "solid",
                    "borderColor": "#17263c",
                    "position": "absolute",
                    "bottom": "16px",
                    "right": "16px",
                    "boxSizing": "border-box"
                }
            },
            "map-template-0": {
                "id": "map-template-0",
                "children": ["panel-template-1"],
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
                    "width": "50%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity": "100",
                    "boxSizing": "border-box"
                }
            },
            "map-template-1": {
                "id": "map-template-1",
                "children": ["panel-template-2"],
                "uniqueAttributes": {
                    "zoom": "10",
                    "latitude": "37.419857",
                    "longitude": "-122.078827",
                    "zoomControl": "false",
                    "fullscreenControl": "false",
                    "scaleControl": "false",
                    "streetViewControl": "false",
                    "mapTypeControl": "false",
                    "mapStyles": "night",
                    "customMapStyles": ""
                },
                "style": {
                    "height": "100%",
                    "width": "50%",
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
                    "value": "Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth\'s surface.",
                    "targetUrl": ""
                },
                "style": {
                    "margin": "8px",
                    "backgroundColor": "#FFFFFF00",
                    "fontSize": "14px"
                }
            },
            "label-template-2": {
                "id": "label-template-2",
                "children": [],
                "uniqueAttributes": {
                    "value": "Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth\'s surface.",
                    "targetUrl": ""
                },
                "style": {
                    "margin": "8px",
                    "color": "#ffffff",
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
                    "margin": "8px",
                    "backgroundColor": "#ffffffFF",
                    "backgroundOpacity": "100"
                }
            },
            "button-template-1": {
                "id": "button-template-1",
                "children": [],
                "uniqueAttributes": {
                    "label": "Button",
                    "disabled": "false"
                },
                "style": {
                    "margin": "8px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity": "100"
                }
            },
            "label-template-3": {
                "id": "label-template-3",
                "children": [],
                "uniqueAttributes": {
                    "value": "Earth Engine",
                    "targetUrl": ""
                },
                "style": {
                    "margin": "8px",
                    "color": "#ffffff",
                    "backgroundColor": "#FFFFFF00",
                    "fontSize": "22px",
                    "fontWeight": "700"
                }
            },
            "label-template-4": {
                "id": "label-template-4",
                "children": [],
                "uniqueAttributes": {
                    "value": "Earth Engine",
                    "targetUrl": ""
                },
                "style": {
                    "margin": "8px",
                    "backgroundColor": "#FFFFFF00",
                    "fontSize": "22px",
                    "fontWeight": "700"
                }
            }
        }
           
    }`,
  },
  {
    id: 'four-maps',
    name: 'Four Maps',
    imageUrl:
      'https://storage.cloud.google.com/ee-app-creator.appspot.com/four-maps.png',
    device: DeviceType.desktop,
    template: `{
        "config": {
            "parentID": "four-maps",
            "parentName": "Four Maps",
            "id": "four-maps-desktop",
            "name": "Four Maps Desktop",
            "textDirection": "left",
            "language": "en",
            "device": "desktop"
        },
        "widgets": {
            "panel-template-0": {
                "id": "panel-template-0",
                "editable": false,
                "hasDropzone": false,
                "children": ["panel-template-1", "panel-template-2"],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "100%",
                    "width": "100%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100", 
                    "position": "relative",
                    "boxSizing": "border-box"
                }
            },
            "panel-template-1": {
                "id": "panel-template-1",
                "editable": true,
                "hasDropzone": true,
                "children": ["label-template-0"],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "8%",
                    "width": "100%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100", 
                    "position": "relative",
                    "boxSizing": "border-box"
                }
            },
            "panel-template-2": {
                "id": "panel-template-2",
                "editable": false,
                "hasDropzone": false,
                "children": ["panel-template-3", "panel-template-4"],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "92%",
                    "width": "100%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100",
                    "boxSizing": "border-box"
                }
            },
            "panel-template-3": {
                "id": "panel-template-3",
                "editable": false,
                "hasDropzone": false,
                "children": ["map-template-0", "map-template-1"],
                "uniqueAttributes": {
                    "layout": "row"
                },
                "style": {
                    "height": "50%",
                    "width": "100%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100",
                    "boxSizing": "border-box"
                }
            },
            "map-template-0": {
                "id": "map-template-0",
                "children": ["panel-template-5"],
                "uniqueAttributes": {
                    "zoom": "10",
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
                    "width": "50%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100",
                    "boxSizing": "border-box"
                }
            },
            "map-template-1": {
                "id": "map-template-1",
                "children": ["panel-template-6"],
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
                }, "style": {
                    "height": "100%",
                    "width": "50%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100",
                    "boxSizing": "border-box"
                }
            },
            "panel-template-4": {
                "id": "panel-template-4",
                "editable": false,
                "hasDropzone": false,
                "children": ["map-template-2", "map-template-3"],
                "uniqueAttributes": {
                    "layout": "row"
                },
                "style": {
                    "height": "50%",
                    "width": "100%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100",
                    "boxSizing": "border-box"
                }
            },
            "map-template-2": {
                "id": "map-template-2",
                "children": ["panel-template-7"],
                "uniqueAttributes": {
                    "zoom": "10",
                    "latitude": "37.419857",
                    "longitude": "-122.078827",
                    "zoomControl": "false",
                    "fullscreenControl": "false",
                    "scaleControl": "false",
                    "streetViewControl": "false",
                    "mapTypeControl": "false",
                    "mapStyles": "aubergine",
                    "customMapStyles": ""
                }, "style": {
                    "height": "100%",
                    "width": "50%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100",
                    "boxSizing": "border-box"
                }
            },
            "map-template-3": {
                "id": "map-template-3",
                "children": ["panel-template-8"],
                "uniqueAttributes": {
                    "zoom": "10",
                    "latitude": "37.419857",
                    "longitude": "-122.078827",
                    "zoomControl": "false",
                    "fullscreenControl": "false",
                    "scaleControl": "false",
                    "streetViewControl": "false",
                    "mapTypeControl": "false",
                    "mapStyles": "dark",
                    "customMapStyles": ""
                }, "style": {
                    "height": "100%",
                    "width": "50%",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100",
                    "boxSizing": "border-box"
                }
            },
            "panel-template-5": {
                "id": "panel-template-5",
                "editable": true,
                "hasDropzone": true,
                "children": [],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "150px",
                    "width": "300px",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100",
                    "position": "absolute",
                    "top": "16px",
                    "left": "16px",
                    "boxSizing": "border-box",
                    "zIndex": "1"
                }
            },
            "panel-template-6": {
                "id": "panel-template-6",
                "editable": true,
                "hasDropzone": true,
                "children": [],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "150px",
                    "width": "300px",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100",
                    "position": "absolute",
                    "top": "16px",
                    "right": "16px",
                    "boxSizing": "border-box",
                    "zIndex": "1"
                }
            },
            "panel-template-7": {
                "id": "panel-template-7",
                "editable": true,
                "hasDropzone": true,
                "children": [],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "150px",
                    "width": "300px",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100",
                    "position": "absolute",
                    "bottom": "16px",
                    "left": "16px",
                    "boxSizing": "border-box",
                    "zIndex": "1"
                }
            },
            "panel-template-8": {
                "id": "panel-template-8",
                "editable": true,
                "hasDropzone": true,
                "children": [],
                "uniqueAttributes": {
                    "layout": "column"
                },
                "style": {
                    "height": "150px",
                    "width": "300px",
                    "margin": "0px",
                    "backgroundColor": "#FFFFFFFF",
                    "backgroundOpacity":"100",
                    "position": "absolute",
                    "bottom": "16px",
                    "right": "16px",
                    "boxSizing": "border-box",
                    "zIndex": "1"
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
                   "height": "px",
                   "width": "98%",
                   "margin": "8px",
                   "backgroundColor": "#FFFFFF00",
                   "borderWidth": "0px",
                   "borderStyle": "solid",
                   "borderColor": "black",
                   "fontSize": "24px",
                   "fontWeight": "700",
                   "fontFamily": "Roboto",
                   "textAlign": "center",
                   "whiteSpace": "normal",
                   "shown": "true"
                }
            }
        }
    }`,
  },
];
