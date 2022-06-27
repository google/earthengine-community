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

// [START earthengine__apidocs__ee_projection]
// Construct projections.
// Printing the projection will show the EPSG code if it is a direct match.
//
// e.g. You will see this for the string 'EPSG:3857'
//   type: Projection
//   crs: EPSG:3857
//   transform: [1,0,0,0,1,0]

print(ee.Projection('EPSG:3857'));  // https://epsg.io/3857
print(ee.Projection('EPSG:4326'));  // https://epsg.io/4326

// WKT projection description for https://epsg.io/27572
var proj = ee.Projection(
    'PROJCS["NTF (Paris) / Lambert zone II", ' +
    '  GEOGCS["NTF (Paris)", ' +
    '    DATUM["Nouvelle Triangulation Francaise (Paris)", ' +
    '      SPHEROID["Clarke 1880 (IGN)", 6378249.2, 293.4660212936269,'+
    '               AUTHORITY["EPSG","7011"]], ' +
    '      AUTHORITY["EPSG","6807"]], ' +
    '    PRIMEM["Paris", 2.5969213, AUTHORITY["EPSG","8903"]], ' +
    '    UNIT["grade", 0.015707963267948967], ' +
    '    AXIS["Geodetic longitude", EAST], ' +
    '    AXIS["Geodetic latitude", NORTH], ' +
    '    AUTHORITY["EPSG","4807"]], ' +
    '  PROJECTION["Lambert_Conformal_Conic_1SP", AUTHORITY["EPSG","9801"]], ' +
    '  PARAMETER["central_meridian", 0.0], ' +
    '  PARAMETER["latitude_of_origin", 52.0], ' +
    '  PARAMETER["scale_factor", 0.99987742], ' +
    '  PARAMETER["false_easting", 600000.0], ' +
    '  PARAMETER["false_northing", 2200000.0], ' +
    '  UNIT["m", 1.0], ' +
    '  AXIS["Easting", EAST], ' +
    '  AXIS["Northing", NORTH], ' +
    '  AUTHORITY["EPSG","27572"]]');
print(proj);  // crs: EPSG:27572
// [END earthengine__apidocs__ee_projection]
