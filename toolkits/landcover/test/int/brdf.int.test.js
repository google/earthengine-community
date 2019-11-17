/**
 * @license
 * Copyright 2019 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Brdf = require('../../impl/brdf.js');
var TestImage = require('../helpers/test-image.js');

withEarthEngine('Brdf', function() {
  // Actual data from LANDSAT/LC08/C01/T1_SR/LC08_185053_20160115.
  var IMAGE_DATE = ee.Date('2016-01-15T09:25:08.6386610Z');
  var PTS = [
      [12.6527, 11.1639], [12.6522, 11.1636], [12.6492, 11.1495],
      [12.6362, 11.0892], [12.4667, 10.2999], [12.2976, 9.51079],
      [12.2936, 9.49232], [12.2802, 9.42941], [12.2802, 9.42852],
      [12.2826, 9.42795], [12.3072, 9.42272], [12.3985, 9.40334],
      [13.3448, 9.20101], [13.9321, 9.07403], [13.9325, 9.07449],
      [14.0541, 9.63027], [14.3133, 10.8110], [14.3133, 10.8122],
      [12.7896, 11.1353], [12.6586, 11.1627], [12.6527, 11.1639]];
  var FOOTPRINT = ee.Geometry.LineString(PTS);

  // The 'real' corner point values.
  var CORNERS = {
    'upperLeft': PTS[0],
    'upperRight': PTS[16],
    'lowerRight': PTS[13],
    'lowerLeft': PTS[7]
  };
  // Converts CORNERS into a FeatureCollection with the key as feature.id.
  var SAMPLES = ee.FeatureCollection(ee.Dictionary(CORNERS).map(function(key, value) {
    return ee.Feature(null, {id: key}).setGeometry(ee.Geometry.Point(value));
  }).values());

  /* Helper functions */

  /* Converts a collection into a dictionary, keyed on id. */
  var collectionToDict = function(results) {
    return ee.Dictionary(results.toList(100).map(function(f) {
      f = ee.Feature(f);
      return [f.get('id'), f.toDictionary().remove(['id'])];
    }).flatten());
  };

  /* Verifies that the given collection, once converted, matches the expected dictionary. */
  var verifyResults = function(collection, expected, tolerance, done) {
    collectionToDict(collection).evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      Object.keys(actual).map(function(key1, index) {
        Object.keys(actual[key1]).map(function(key2, index2) {
          expect(actual[key1][key2]).toBeCloseTo(expected[key1][key2], tolerance);
        });
      });
      done();
    });
  };

  /* Convert degrees to radians */
  var degToRad = function(deg) {
    return Math.PI * deg / 180.0;
  };

  it('findCorners', function(done) {
    var corners = Brdf.findCorners(FOOTPRINT);
    ee.Dictionary(corners).evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      expect(actual).toEqual(CORNERS);
      done();
    });
  });

  it('viewAngles', function(done) {
    var angles = Brdf.viewAngles(FOOTPRINT);
    var results = angles.reduceRegions(SAMPLES, ee.Reducer.first(), 1);
    // The zenith values on the edges should be ~equal but opposite and about |7.5| degrees.
    // The azimuth values should all be equal and about 98 degrees at the equator (but this image
    // is a little north of the equator, so it's about a 12 degrees tilt.
    var expected = {
      lowerLeft: {viewAz: degToRad(102.2508), viewZen: degToRad(7.5)},
      lowerRight: {viewAz: degToRad(102.2508), viewZen: -degToRad(7.5)},
      upperLeft: {viewAz: degToRad(102.2508), viewZen: degToRad(7.5)},
      upperRight: {viewAz: degToRad(102.2508), viewZen: -degToRad(7.5)}
    };
    verifyResults(results, expected, 5, done);
  });

  it('solarAngles', function(done) {
    var solar = Brdf.solarPosition(IMAGE_DATE);
    var results = solar.reduceRegions(SAMPLES, ee.Reducer.first(), 1);
    // The image metadata claims center point values of
    //   SOLAR_AZIMUTH_ANGLE: 139.120117 (2.428104 radians)
    //   SOLAR_ZENITH_ANGLE: 41.492081  (0.7241734 radians)
    // so these computed golden values are plausible.
    var expected = {
      lowerLeft: {sunAz: 2.4034418, sunZen: 0.72577137},
      lowerRight: {sunAz: 2.4278879, sunZen: 0.70224114},
      upperLeft: {sunAz: 2.4320877, sunZen: 0.74421999},
      upperRight: {sunAz: 2.4574692, sunZen: 0.72123555}
    };
    verifyResults(results, expected, 6, done);
  });

  it('applyBrdfCorrection', function(done) {
    var testImage = TestImage.create({
      blue: 1,
      green: 2,
      red: 3,
      nir: 4,
      swir1: 5,
      swir2: 6
    }).set({
      'system:footprint': FOOTPRINT,
      'system:time_start': IMAGE_DATE.millis()
    });

    // Only testing the final correction factor.
    var corrected = Brdf.applyBrdfCorrection(testImage, true).select('.*cFactor');
    var results = corrected.reduceRegions(SAMPLES, ee.Reducer.first(), 1);

    var expected = {
      lowerLeft: {
        constant_cFactor: 1.0036134752886672,
        constant_1_cFactor: 1.0106637919824162,
        constant_2_cFactor: 1.0132861351850972,
        constant_3_cFactor: 1.0039653011535756,
        constant_4_cFactor: 1.0129632165377012,
        constant_5_cFactor: 1.0182481216310295,
      },
      lowerRight: {
        constant_cFactor: 1.0525261920726847,
        constant_1_cFactor: 1.0629536098240306,
        constant_2_cFactor: 1.0565536471364805,
        constant_3_cFactor: 1.0549740480772705,
        constant_4_cFactor: 1.0555684766242974,
        constant_5_cFactor: 1.0553092018815695,
      },
      upperLeft: {
        constant_cFactor: 1.0073745896780497,
        constant_1_cFactor: 1.0157166790693644,
        constant_2_cFactor: 1.0181717059179505,
        constant_3_cFactor: 1.007911772291441,
        constant_4_cFactor: 1.0177562221931014,
        constant_5_cFactor: 1.0235074790751775,
      },
      upperRight: {
        constant_cFactor: 1.055724854122286,
        constant_1_cFactor: 1.0674482551035391,
        constant_2_cFactor: 1.0609035615335456,
        constant_3_cFactor: 1.0583501295587392,
        constant_4_cFactor: 1.059828008690496,
        constant_5_cFactor: 1.060044610660839,
      }
    };
    verifyResults(results, expected, 9, done);
  });
});
