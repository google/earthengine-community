---
title: Editing the Base Map in Earth Engine
description: If you are getting bored of looking at the same two default basemaps in Earth Engine, or need to use a specific visualization for functionality/convenience, this tutorial will show you how to edit all of its characteristics. 
author: TC25
tags: Earth Engine, Base Map, UI, Widgets
date_published: 2019-09-16
---

[Open In Code Editor](https://code.earthengine.google.com/d5008ced995fc0e16e5434fa2b47e21c)

The user is going to learn how to change the options of the map object to create new base maps

## The default maps in Earth Engine

Earth Engine's base maps are those in Google's Map API. The default options include:

- roadmap, which displays the default road map view,
- satellite, which displays Google Earth satellite images,
- hybrid, which displays a mixture of normal and satellite views, and
- terrain, which displays a physical map based on terrain information.

## Changing the basic map style

We can start by changing the style of the base map. One easy fix is to invert the lightness to get a darker background, like so:

```javascript

var Base_change = [
    stylers: [ {invert_lightness: true} ]
]
Map.setOptions("Base_change",{"Base_change":Base_change})

```
The main styler options include:

  - Hue: indicates the basic color
  - lightness:indicates percentage change in brightness of element
  - saturation: indicates percentage change in basic color of element
  - gamma: Gamma correction of the element (0.01 and 10.0)
  - invert_lightness: inverts the existing lightness
  - visibility: Changes visibility options for an element (on, off, or simplified)
  - color: Sets the color of elements (using RGB Hex Strings)
  - weight: Sets the weight of a feature in pixels


## Changing map elements

The google maps API (and by extension, Earth Engine) gives you the ability to control a huge number of map features and elements

The full list of features that you can modify:

- all (default) selects all features.
- administrative selects all administrative areas. Styling affects only the labels of administrative areas, not the geographical borders or fill.
- administrative.country selects countries.
- administrative.land_parcel selects land parcels.
- administrative.locality selects localities.
- administrative.neighborhood selects neighborhoods.
- administrative.province selects provinces.
- landscape selects all landscapes.
- landscape.man_made selects structures built by humans.
- landscape.natural selects natural features.
- landscape.natural.landcover selects landcover features.
- landscape.natural.terrain selects terrain features.
- poi selects all points of interest.
- poi.attraction selects tourist attractions.
- poi.business selects businesses.
- poi.government selects government buildings.
- poi.medical selects emergency services, including hospitals, pharmacies, police, doctors, and others.
- poi.park selects parks.
- poi.place_of_worship selects places of worship, including churches, temples, mosques, and others.
- poi.school selects schools.
- poi.sports_complex selects sports complexes.
- road selects all roads.
- road.arterial selects arterial roads.
- road.highway selects highways.
- road.highway.controlled_access selects highways with controlled access.
- road.local selects local roads.
- transit selects all transit stations and lines.
- transit.line selects transit lines.
- transit.station selects all transit stations.
- transit.station.airport selects airports.
- transit.station.bus selects bus stops.
- transit.station.rail selects rail stations.
- water selects bodies of water.


The full list of features that you can modify:

- all (default) selects all elements of the specified feature.
- geometry selects all geometric elements of the specified feature.
- geometry.fill selects only the fill of the feature's geometry.
- geometry.stroke selects only the stroke of the feature's geometry.
- labels selects the textual labels associated with the specified feature.
- labels.icon selects only the icon displayed within the feature's label.
- labels.text selects only the text of the label.
- labels.text.fill selects only the fill of the label. The fill of a label is typically rendered as a colored outline that surrounds the label text.
- labels.text.stroke selects only the stroke of the label's text.

All styler options work with each of these features

Let's consider a couple of examples to edit other elements and features

```javascript


//Remove icons
var Icon_change = [
  {   // Change map saturation.
    stylers: [ {gamma:.2} ]

  },{ // Change label properties.
    elementType: 'labels',
    stylers: [ {visibility: 'off',color: '#000055' } ]
  },{ // Change road properties.
    featureType: 'road',
    elementType: 'geometry',
    stylers: [ { visibility: 'off',color: '#000055' } ]
  },{ // Change road labels
    featureType: 'road',
    elementType: 'labels',
    stylers: [ { visibility: 'off' } ]
  },{ // Change icon properties
    elementType: 'labels.icon',
    stylers: [ { visibility: 'off' } ]
  },{ // Change POI options
    featureType: 'poi',
    elementType: 'all',
    stylers: [ { visibility: 'off' }]
  },{
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                visibility: 'off'
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                visibility: 'off'
            }
        ]
    }
];


//Enhanced road network visualization


var Road_network =[{stylers: [ {saturation: -100} ]},
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                color: '#000055'
            },
            {
                weight: 2.5
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [

            {
                color: '#000000'
            },
            {
                weight: 2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                color: '#FF0000'
            },
                        {
                weight: 1.8
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
        
            {
                color: '#00FF55'
            },
                        {
                weight: 1.5
            }
        ]
    }
]

Map.setOptions('Road_network',{'Icon_change': Icon_change, 'Road_network':Road_network});
```

![Road](Road.PNG)

## Cheat codes

There is a way to create almost any basemap you want without the hassle of tweaking any options. Enter https://snazzymaps.com/
Copy any of the javascript properties from that website and it will show up on Earth Engine. Consider the two examples below:

```javascript


var Snazzy_black=[
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#eaeaea"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#dedede"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#434343"
            },
            {
                "visibility": "on"
            }
        ]
    }
]


var Snazzy_color=[
    {
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#0F0919"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#E4F7F7"
            }
        ]
    },
    {
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#002FA7"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#E60003"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#FBFCF4"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#FFED00"
            }
        ]
    },
    {
        "featureType": "poi.government",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#D41C1D"
            }
        ]
    },
    {
        "featureType": "poi.school",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#BF0000"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "saturation": -100
            }
        ]
    }
]


Map.setOptions('Snazzy_black',{'Snazzy_black':Snazzy_black,'Snazzy_color':Snazzy_color})

```

![Dark](Snazzy_black.PNG)

You can find out more about all the options in Google Map API here: https://developers.google.com/maps/documentation/javascript/reference#MapTypeStyle
