/**
 * Copyright 2022 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START earthengine__apidocs__ee_filter_maxdifference]
// Field site vegetation characteristics from projects in western USA.
var fc = ee.FeatureCollection('BLM/AIM/v1/TerrADat/TerrestrialAIM')
  .filter('ProjectName == "Colorado NWDO Kremmling FO 2016"');

// Display field plots on the map.
Map.setCenter(-107.792, 39.871, 7);
Map.addLayer(fc);

// Compare the per-feature values of two properties and filter the collection
// based on the results of various relational expressions. The two properties
// to compare are invasive and non-invasive annual forb cover at each plot.
var leftProperty = 'InvAnnForbCover_AH';
var rightProperty = 'NonInvAnnForbCover_AH';

print('Plots where invasive forb cover is…');

print('…EQUAL to non-invasive cover',
      fc.filter(ee.Filter.equals(
        {leftField: leftProperty, rightField: rightProperty})));

print('…NOT EQUAL to non-invasive cover',
      fc.filter(ee.Filter.notEquals(
        {leftField: leftProperty, rightField: rightProperty})));

print('…LESS THAN non-invasive cover',
      fc.filter(ee.Filter.lessThan(
        {leftField: leftProperty, rightField: rightProperty})));

print('…LESS THAN OR EQUAL to non-invasive cover',
      fc.filter(ee.Filter.lessThanOrEquals(
        {leftField: leftProperty, rightField: rightProperty})));

print('…GREATER THAN non-invasive cover',
      fc.filter(ee.Filter.greaterThan(
        {leftField: leftProperty, rightField: rightProperty})));

print('…GREATER THAN OR EQUAL to non-invasive cover',
      fc.filter(ee.Filter.greaterThanOrEquals(
        {leftField: leftProperty, rightField: rightProperty})));

print('…is not greater than 10 percent different than non-invasive cover',
      fc.filter(ee.Filter.maxDifference(
        {difference: 10, leftField: leftProperty, rightField: rightProperty})));

// Instead of comparing values of two feature properties using the leftField
// and rightField parameters, you can compare a property value (leftProperty)
// against a constant value (rightValue).
print('Plots where invasive forb cover is greater than 20%',
      fc.filter(ee.Filter.greaterThan(
        {leftField: leftProperty, rightValue: 20})));

// You can also swap the operands to assign the constant to the left side of
// the relational expression (leftValue) and the feature property on the right
// (rightField). Here, we get the complement of the previous example.
print('Plots where 20% is greater than invasive forb cover.',
      fc.filter(ee.Filter.greaterThan(
        {leftValue: 20, rightField: leftProperty})));

// Binary filters are useful in joins. For example, group all same-site plots
// together using a saveAll join.
var groupingProp = 'SiteID';
var sitesFc = fc.distinct(groupingProp);

var joinFilter = ee.Filter.equals(
  {leftField: groupingProp, rightField: groupingProp});

var groupedPlots = ee.Join.saveAll('site_plots').apply(sitesFc, fc, joinFilter);
print('List of plots in first site', groupedPlots.first().get('site_plots'));
// [END earthengine__apidocs__ee_filter_maxdifference]
