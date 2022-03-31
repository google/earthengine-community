/**
 * Copyright 2021 The Google Earth Engine Community Authors
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
 *
 *
 * Example script for visualizing LCMS change summaries, land cover, and land use.
 *
 * A more in-depth visualization of LCMS products is available at:
 * https://apps.fs.usda.gov/lcms-viewer/
 *
 * Contact sm.fs.lcms@usda.gov with any questions or specific data requests.
 */

// #############################################################################
// ### Define visualization parameters ###
// #############################################################################

var startYear = 1985;
var endYear = 2020;
var lossYearPalette = ['ffffe5', 'fff7bc', 'fee391', 'fec44f', 'fe9929',
                       'ec7014', 'cc4c02'];
var gainYearPalette = ['c5ee93', '00a398'];
var durationPalette = ['BD1600', 'E2F400','0C2780'];

var names_values_colors = {
  'Land_Cover': {
    'names': [
       'Trees',
       'Tall Shrubs & Trees Mix',
       'Shrubs & Trees Mix',
       'Grass/Forb/Herb & Trees Mix',
       'Barren & Trees Mix',
       'Tall Shrubs',
       'Shrubs',
       'Grass/Forb/Herb & Shrubs Mix',
       'Barren & Shrubs Mix',
       'Grass/Forb/Herb',
       'Barren & Grass/Forb/Herb Mix',
       'Barren or Impervious',
       'Snow or Ice',
       'Water',
       'Non-Processing Area Mask'
    ],
    'colors': [
       '005e00',
       '008000',
       '00cc00',
       'b3ff1a',
       '99ff99',
       'b30088',
       'e68a00',
       'ffad33',
       'ffe0b3',
       'ffff00',
       'AA7700',
       'd3bf9b',
       'ffffff',
       '4780f3',
       '1B1716'
    ]
  },
  'Land_Use': {
    'names': [
       'Agriculture',
       'Developed',
       'Forest',
       'Non-Forest Wetland',
       'Other',
       'Rangeland or Pasture',
       'Non-Processing Area Mask'
    ],
    'colors': [
       'efff6b',
       'ff2ff8',
       '1b9d0c',
       '97ffff',
       'a1a1a1',
       'c2b34a',
       '1B1716'
    ]
  },
  'Change': {
    'names': [
       'Stable',
       'Slow Loss',
       'Fast Loss',
       'Gain',
       'Non-Processing Area Mask'
    ],
    'colors': [
       '3d4551',
       'f39268',
       'd54309',
       '00a398',
       '1B1716'
    ]
  }
};
var lossYearViz = {min: startYear, max: endYear, palette: lossYearPalette};
var gainYearViz = {min: startYear, max: endYear, palette: gainYearPalette};
var durationViz = {min: 1, max: 5, palette: durationPalette};

var lcViz = {min: 1, max: 15, palette: names_values_colors.Land_Cover.colors};
var luViz = {min: 1, max: 7, palette: names_values_colors.Land_Use.colors};



// #############################################################################
// ### Define functions ###
// #############################################################################

/**
 * Convert given code to year that number was present in the image.
 */
function getMostRecentChange(c, code){
  return c.map(function(img) {
    var yr = ee.Date(img.get('system:time_start')).get('year');
    return ee.Image(yr).int16().rename(['year']).updateMask(img.eq(code))
      .copyProperties(img,['system:time_start']);
  });
}


// #############################################################################
// ### Bring in LCMS annual outputs ###
// #############################################################################

var lcms = ee.ImageCollection('USFS/GTAC/LCMS/v2020-5');
print('Available study areas:', lcms.aggregate_histogram('study_area').keys());
print('Available LCMS products', lcms.first().bandNames());
print(ui.Label('Learn more about visualization of LCMS products here',
  null, 'https://apps.fs.usda.gov/lcms-viewer/'));

// Set up time periods to compare land cover and land use
var earlySpan = [startYear, startYear+4];
var lateSpan = [endYear-4, endYear];



// #############################################################################
// ### Visualize Land Use change ###
// #############################################################################

var lu = lcms.select(['Land_Use']);
var earlyLu = lu.filter(
  ee.Filter.calendarRange(earlySpan[0], earlySpan[1], 'year')).mode();
var lateLu = lu.filter(
  ee.Filter.calendarRange(lateSpan[0], lateSpan[1], 'year')).mode();
Map.addLayer(
  earlyLu, luViz, 'Early Land Use Mode ('+earlySpan.join('-')+')', false);
Map.addLayer(
  lateLu, luViz, 'Recent Land Use Mode ('+lateSpan.join('-')+')', false);



// #############################################################################
// ### Visualize Land Cover change ###
// #############################################################################

var lc = lcms.select(['Land_Cover']);
var earlyLc = lc.filter(
  ee.Filter.calendarRange(earlySpan[0], earlySpan[1], 'year')).mode();
var lateLc = lc.filter(
  ee.Filter.calendarRange(lateSpan[0], lateSpan[1], 'year')).mode();
Map.addLayer(
  earlyLc, lcViz, 'Early Land Cover Mode ('+earlySpan.join('-')+')', false);
Map.addLayer(
  lateLc, lcViz, 'Recent Land Cover Mode ('+lateSpan.join('-')+')', false);



// #############################################################################
// ### Visualize Change products ###
// #############################################################################

// Select the change band. Land_Cover and Land_Use are also available.
var change = lcms.select(['Change']);

// Convert to year collection for a given code.
var slowLossYears = getMostRecentChange(change, 2);
var fastLossYears = getMostRecentChange(change, 3);
var gainYears = getMostRecentChange(change, 4);

// Find the most recent year.
var mostRecentSlowLossYear = slowLossYears.max();
var mostRecentFastLossYear = fastLossYears.max();
var mostRecentGainYear = gainYears.max();

// Find the duration.
var slowLossDuration = slowLossYears.count();
var fastLossDuration = fastLossYears.count();
var gainDuration = gainYears.count();

// Add year summaries to the map.
Map.addLayer(
  mostRecentSlowLossYear, lossYearViz, 'Most Recent Slow Loss Year', true);
Map.addLayer(
  mostRecentFastLossYear, lossYearViz, 'Most Recent Fast Loss Year', true);
Map.addLayer(mostRecentGainYear, gainYearViz, 'Most Recent Gain Year', true);

// Add durations to the map.
Map.addLayer(slowLossDuration,durationViz, 'Slow Loss Duration', false);
Map.addLayer(fastLossDuration,durationViz, 'Fast Loss Duration', false);
Map.addLayer(gainDuration,durationViz, 'Gain Duration', false);



// #############################################################################
// ### Map setup ###
// #############################################################################

Map.centerObject(lcms.filter(ee.Filter.eq('study_area', 'CONUS')), 5);
Map.setOptions('HYBRID');
