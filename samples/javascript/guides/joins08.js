/**
 * Copyright 2020 The Google Earth Engine Community Authors
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
 *   from 'Joins - Spatial joins' section
 */

// [START earthengine__joins08__spatial_join]
// Load the primary collection: US state boundaries.
var states = ee.FeatureCollection('TIGER/2018/States');

// Load the secondary collection: power plants.
var powerPlants = ee.FeatureCollection('WRI/GPPD/power_plants');

// Define a spatial filter as geometries that intersect.
var spatialFilter = ee.Filter.intersects({
  leftField: '.geo',
  rightField: '.geo',
  maxError: 10
});

// Define a save all join.
var saveAllJoin = ee.Join.saveAll({
  matchesKey: 'power_plants',
});

// Apply the join.
var intersectJoined = saveAllJoin.apply(states, powerPlants, spatialFilter);

// Add power plant count per state as a property.
intersectJoined = intersectJoined.map(function(state) {
  // Get "power_plant" intersection list, count how many intersected this state.
  var nPowerPlants = ee.List(state.get('power_plants')).size();
  // Return the state feature with a new property: power plant count.
  return state.set('n_power_plants', nPowerPlants);
});

// Make a bar chart for the number of power plants per state.
var chart = ui.Chart.feature.byFeature(intersectJoined, 'NAME', 'n_power_plants')
  .setChartType('ColumnChart')
  .setSeriesNames({n_power_plants: 'Power plants'})
  .setOptions({
    title: 'Power plants per state',
    hAxis: {title: 'State'},
    vAxis: {title: 'Frequency'}});

// Print the chart to the console.
print(chart);
// [END earthengine__joins08__spatial_join]
