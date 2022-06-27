/**
 * Copyright 2022 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Earth Engine Developer's Guide examples
 *     from ee.FeatureView overview section
 */

// [START earthengine__featureview_overview__export]
// Import the WDPA feature collection.
var wdpa = ee.FeatureCollection('WCMC/WDPA/current/polygons');

// Export the WDPA FeatureCollection as a FeatureView asset.
Export.table.toFeatureView({
  collection: wdpa,
  assetId: 'wdpa-featureview-demo',
  description: 'wdpa-featureview-demo',
  maxFeaturesPerTile: 1500,
  thinningStrategy: 'HIGHER_DENSITY',
  thinningRanking: ['REP_AREA DESC'],
  zOrderRanking: ['REP_AREA DESC'],
});
// [END earthengine__featureview_overview__export]

// [START earthengine__featureview_overview__visualizing]
// Define the FeatureView asset ID.
var assetId = 'WCMC/WDPA/current/polygons_FeatureView';

// Import the FeatureView asset as a FeatureViewLayer.
var layer = ui.Map.FeatureViewLayer(assetId);

// Add the FeatureViewLayer to the map.
Map.add(layer);
// [END earthengine__featureview_overview__visualizing]

// [START earthengine__featureview_overview__styling]
// Set visualization properties for the defined layer.
layer.setVisParams({
  color: {
    property: 'MARINE',
    categories: [
      ['0', 'purple'],
      ['1', 'green'],
      ['2', 'blue'],
    ]
  },
  fillColor: {
    property: 'IUCN_CAT',
    defaultValue: 'd3d3d3',
    categories: [
      ['Ia', 'a6cee3'],
      ['Ib', '1f78b4'],
      ['II', 'b2df8a'],
      ['III', '33a02c'],
      ['IV', 'fb9a99'],
      ['V', 'e31a1c'],
      ['VI', 'fdbf6f'],
    ]
  },
  fillOpacity: {
    property: 'REP_AREA',
    mode: 'interval',
    palette: [
      [0, 0.5],
      [80, 0.35],
      [2000, 0.22],
      [5000, 0.15],
    ],
  },
  width: 1.0,
  pointSize: 6.0,
});
// [END earthengine__featureview_overview__styling]

// [START earthengine__featureview_overview__filtering]
// Define the FeatureView asset ID.
var assetId = 'WCMC/WDPA/current/polygons_FeatureView';

// Import the FeatureView asset as a FeatureViewLayer.
var layer = ui.Map.FeatureViewLayer(assetId, null, 'WDPA FeatureViewLayer');

// Callback function to update FeatureViewLayer style.
var updateVisParams = function() {
  layer.setVisParams({
    color: {
      property: 'MARINE',
      categories: [
        ['0', 'purple'],
        ['1', 'green'],
        ['2', 'blue'],
      ]
    },
    fillColor: {
      property: 'IUCN_CAT',
      defaultValue: 'd3d3d3',
      categories: [
        ['Ia', 'a6cee3'],
        ['Ib', '1f78b4'],
        ['II', 'b2df8a'],
        ['III', '33a02c'],
        ['IV', 'fb9a99'],
        ['V', 'e31a1c'],
        ['VI', 'fdbf6f'],
      ]
    },
    fillOpacity: {
      property: 'REP_AREA',
      mode: 'interval',
      palette: [
        [0, 0.5],
        [80, 0.35],
        [2000, 0.22],
        [5000, 0.15],
      ],
    },
    width: 1.0,
    pointSize: 6.0,
    rules: [
      {
        filter: ee.Filter.lt('REP_AREA', filterSlider.getValue()),
        isVisible: false,
      },
    ],
  });
};

// Slider widget that calls the updateVisParams function on change.
var filterSlider = ui.Slider({
  min: 0,
  max: 10000,
  step: 10,
  value: 0,
  style: { stretch: 'horizontal'},
  onChange: updateVisParams,
});
var filterSliderLabel = ui.Label(
  'Adjust slider to hide features less than the specified area (km²)');

// Add the slider to the map.
Map.add(ui.Panel([filterSliderLabel, filterSlider]));

// Initialize the FeatureViewLayer style.
updateVisParams();

// Add the FeatureViewLayer to the map.
Map.add(layer);
// [END earthengine__featureview_overview__filtering]
