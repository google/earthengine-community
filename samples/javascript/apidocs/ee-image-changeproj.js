/**
 * Copyright 2021 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_image_changeproj]
// A DEM image object.
var img = ee.Image('MERIT/DEM/v1_0_3');

// Construct a projection object from a WKT string or EPSG code, for example,
// the Robinson projection (https://epsg.io/54030).
var proj = ee.Projection(
  'PROJCS["World_Robinson",' +
      'GEOGCS["GCS_WGS_1984",' +
          'DATUM["WGS_1984",' +
              'SPHEROID["WGS_1984",6378137,298.257223563]],' +
          'PRIMEM["Greenwich",0],' +
          'UNIT["Degree",0.017453292519943295]],' +
      'PROJECTION["Robinson"],' +
      'UNIT["Meter",1]]'
)
// Optionally adjust projection scale; stretch layer larger in this case.
.scale(0.9, 0.9);

// "Paint" the image in the desired projection onto the projection of
// the map canvas ('EPSG:3857').
var imgProj = img.changeProj(proj, 'EPSG:3857');

// Add an overlay image to the map to cover the default base layers.
Map.setCenter(0, 0, 2);
Map.addLayer(ee.Image(1), {palette: 'grey'}, 'Grey background', false);

// Add the projection-tweaked image to the map.
Map.addLayer(imgProj, {min: 0, max: 3000}, 'DEM in Robinson projection');
// [END earthengine__apidocs__ee_image_changeproj]
