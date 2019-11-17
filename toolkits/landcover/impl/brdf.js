/**
 * @license
 * Copyright 2019 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var NamedArgs = require('users/google/toolkits:landcover/impl/named-args.js').NamedArgs;

/* Rename the bands of image by adding a suffix. */
var addBandSuffix = function(image, suffix) {
  var bandNames = image.bandNames().map(function(s) {
    return ee.String(s).cat(suffix);
  });
  return image.rename(bandNames);
};

var deg2rad = function(value) {
  return ee.Image(value).multiply(Math.PI).divide(180);
};

/* Computes a string expression and adds it to the given image. */
var addExpr = function(img, expr, args) {
  args = args || {};
  args['pi'] = Math.PI;
  args['i'] = img;
  var result = img.expression(expr, args);
  return img.addBands(result, null, true);
};

/* Compute the center point between two points, on the sphere */
var pointBetween = function(pointA, pointB) {
  return ee.Geometry.LineString([pointA, pointB], null, true).centroid().coordinates();
};

/* Extract the x value from a point. */
var getX = function(point) {
  return ee.List(point).getNumber(0);
};

/* Extract the y value from a point. */
var getY = function(point) {
  return ee.List(point).getNumber(1);
};

/* Compute the slope between two points */
var slopeBetween = function(pointA, pointB) {
  return ee.Number.expression('(yA - yB) / (xA - xB)', {
    yA: getY(pointA),
    yB: getY(pointB),
    xA: getX(pointA),
    xB: getX(pointB)
  });
};

/* Make a line from two points. */
var toLine = function(pointA, pointB) {
  return ee.Geometry.LineString([pointA, pointB], null, true);
};

var findCorners = function(footprint) {
  var args = NamedArgs.extractFromFunction(findCorners, arguments);
  footprint = args.footprint;
  var coords = ee.Geometry(footprint).coordinates();
  var xValues = coords.map(getX);
  var yValues = coords.map(getY);

  /* Get the coordinate corresponding to the item in values closest to the targetValue. */
  var findCorner = function(targetValue, values) {
    var diff = values.map(function(value) {
      return ee.Number(value).subtract(targetValue).abs();
    });
    var minValue = diff.reduce(ee.Reducer.min());
    return coords.get(diff.indexOf(minValue));
  };

  // NOTE: This function relies on the order of the points in geometry.bounds being constant.
  var bounds = ee.List(footprint.bounds(1).coordinates().get(0));

  return {
    'upperLeft': findCorner(getY(bounds.get(3)), yValues),
    'upperRight': findCorner(getX(bounds.get(2)), xValues),
    'lowerRight': findCorner(getY(bounds.get(1)), yValues),
    'lowerLeft': findCorner(getX(bounds.get(0)), xValues)
  };
};


/* Compute the viewing angles from the scene's geometry. */
var viewAngles = function(footprint) {
  var args = NamedArgs.extractFromFunction(viewAngles, arguments);
  footprint = args.footprint;

  var maxDistanceToSceneEdge = 1500000;
  var maxSatelliteZenith = 7.5;

  var corners = findCorners(footprint);
  // Get a center-line by splitting the distance between the 'top' points and the 'bottom' points.
  var upperCenter = pointBetween(corners['upperLeft'], corners['upperRight']);
  var lowerCenter = pointBetween(corners['lowerLeft'], corners['lowerRight']);
  var slope = slopeBetween(lowerCenter, upperCenter);

  // An empty image to hold the results.
  var result = ee.Image().select();
  result = addExpr(result, 'viewAz = pi / 2 - atan(-1 / slope)', {slope: slope});

  var leftLine = toLine(corners['upperLeft'], corners['lowerLeft']);
  var rightLine = toLine(corners['upperRight'], corners['lowerRight']);
  var leftDistance = ee.FeatureCollection(leftLine).distance(maxDistanceToSceneEdge);
  var rightDistance = ee.FeatureCollection(rightLine).distance(maxDistanceToSceneEdge);
  result = addExpr(result,
      'viewZen = ((right * maxZen * 2) / (right + left) - maxZen) * pi / 180', {
        left: leftDistance,
        right: rightDistance,
        maxZen: maxSatelliteZenith
      });

  return result;
};

/**
 * Computes the solar position on a per-pixel basis.
 *
 * @param {!ee.Date} date The date for which to compute the solar angles.
 * @return {!ee.Image} An image with sunZen and sunAz bands.
 *
 * Converted from Fmask's landsatangles.py:
 * https://bitbucket.org/chchrsc/python-fmask/downloads/, which in turn, is
 * converted from the 6S POSSOL.f fortran routine:
 * https://gitlab.com/satelligence/6SV1.1/blob/master/POSSOL.f
 *
 * The general approach is to estimate the nadir line from the "middle" of the
 * scene. The satellite azimuth is assumed to be at right angles to this nadir
 * line, which is only roughly correct. For the whisk-broom sensors on Landsat-5
 * and Landsat-7, this angle is not 90 degrees, but is affected by earth rotation
 * and is latitude dependent. For Landsat-8, the scan line is at right angles, due
 * to the compensation for earth rotation, but the push-broom is made up of
 * sub-modules which point in slightly different directions, giving slightly
 * different satellite azimuths along the scan line. None of these effects are
 * included in the current estimates. The satellite zenith is estimated based on
 * the nadir point, the scan-line, and the assumed satellite altitude, and
 * includes the appropriate allowance for earth curvature
 */
var solarPosition = function(date) {
  var args = NamedArgs.extractFromFunction(solarPosition, arguments);
  date = args.date;


  var local = ee.Image.pixelLonLat();
  local = addExpr(local, 'lonDeg = i.longitude');
  local = addExpr(local, 'latRad = i.latitude * pi / 180');

  // Julian date proportion in Radians
  var jdpr = date.getFraction('year').multiply(2 * Math.PI);

  local = addExpr(local, 'meanSolarTime = (secondsGMT / 3600) + (i.lonDeg / 15)', {
    secondsGMT: date.getRelative('second', 'day')
  });

  local = addExpr(local, 'localSolarDiff = (0.000075 '
      + '+ 0.001868 * cos(1 * jdpr) - 0.032077 * sin(1 * jdpr) '
      + '- 0.014615 * cos(2 * jdpr) - 0.040849 * sin(2 * jdpr))'
      + ' * 12 * 60 / pi', {jdpr: jdpr});

  local = addExpr(local, 'trueSolarTime = i.meanSolarTime + i.localSolarDiff / 60 - 12');
  local = addExpr(local, 'angleHour = i.trueSolarTime * 15 * pi / 180');

  // Solar declination, in radians.
  local = addExpr(local, 'delta = 0.006918' +
      '- 0.399912 * cos(1 * jdpr) + 0.070257 * sin(1 * jdpr)' +
      '- 0.006758 * cos(2 * jdpr) + 0.000907 * sin(2 * jdpr)' +
      '- 0.002697 * cos(3 * jdpr) + 0.001480 * sin(3 * jdpr)', {jdpr: jdpr});

  local = addExpr(local, 'cosSunZen = sin(i.latRad) * sin(i.delta) ' +
      '+ cos(i.latRad) * cos(i.delta) * cos(i.angleHour)');

  local = addExpr(local, 'sunZen = acos(i.cosSunZen)');
  local = addExpr(local,
      'sinSunAzSW = clamp(cos(i.delta) * sin(i.angleHour) / sin(i.sunZen), -1, 1)');
  local = addExpr(local, 'cosSunAzSW = (-cos(i.latRad) * sin(i.delta)' +
      '+ sin(i.latRad) * cos(i.delta) * cos(i.angleHour)) / sin(i.sunZen)');
  local = addExpr(local, 'sunAzSW = asin(i.sinSunAzSW)');
  local = addExpr(local,
      'sunAzSW = i.cosSunAzSW <= 0 ? pi - i.sunAzSW : i.sunAzSW');
  local = addExpr(local,
      'sunAzSW = i.cosSunAzSW > 0 && i.sinSunAzSW <= 0 ? 2 * pi + i.sunAzSW : i.sunAzSW');
  local = addExpr(local, 'sunAz = i.sunAzSW + pi');
  local = addExpr(local, 'sunAz = i.sunAz > 2 * pi ? i.sunAz - 2 * pi : i.sunAz');

  return local.select(['sunZen', 'sunAz']);
};

/* Computes the kgeo and kvol kernels. */
var kernel = function(thetaI, thetaV, azimuth) {
  var dict = {
    b: 1,
    r: 1,
    h: 2,
  };
  var local = ee.Image.cat(thetaI, thetaV, azimuth).rename(['theta_i', 'theta_v', 'azimuth']);

  // ================ calculate k_vol  ================
  local = addExpr(local,
      'cos_g = cos(i.theta_i) * cos(i.theta_v) + sin(i.theta_i) * sin(i.theta_v) * cos(i.azimuth)',
      dict);
  local = addExpr(local, 'g = acos(max(-1, min(i.cos_g, 1)))', dict);
  local = addExpr(local,
      'k_vol = ((pi/2 - i.g) * cos(i.g) + sin(i.g)) / (cos(i.theta_i) + cos(i.theta_v)) - (pi/4)',
      dict);
  // ================ calculate k_geo  ================
  local = addExpr(local, 'theta_i1 = atan(max(b / r * tan(i.theta_i), 0))', dict);
  local = addExpr(local, 'theta_v1 = atan(max(b / r * tan(i.theta_v), 0))', dict);

  local = addExpr(local, 'g_1 = cos(i.theta_i1) * cos(i.theta_v1) ' +
      '+ sin(i.theta_i1) * sin(i.theta_v1) * cos(i.azimuth)', dict);
  local = addExpr(local, 'g_1 = acos(clamp(i.g_1, -1, 1))', dict);

  local = addExpr(local, 'D = tan(i.theta_i1)**2 + tan(i.theta_v1)**2 '
      + '- (2 * tan(i.theta_i1) * tan(i.theta_v1) * cos(i.azimuth))', dict);
  local = addExpr(local, 'D = sqrt(max(i.D, 0))', dict);

  local = addExpr(local, 'tmp = (tan(i.theta_i1) * tan(i.theta_v1) * sin(i.azimuth))', dict);
  local = addExpr(local,
      'cos_t = h / b * (sqrt(i.D * i.D + i.tmp * i.tmp)) / (1/cos(i.theta_i1) + 1/cos(i.theta_v1))',
      dict);
  local = addExpr(local, 't = acos(clamp(i.cos_t, -1, 1))', dict);

  local = addExpr(local,
      'O = 1/pi * (i.t - sin(i.t) * cos(i.t)) * (1/cos(i.theta_i1) + 1/cos(i.theta_v1))',
      dict);
  local = addExpr(local, 'O = max(0, i.O)', dict);

  local = addExpr(local, 'k_geo = i.O - 1/cos(i.theta_i1) - 1/cos(i.theta_v1) '
      + '+ (1 + cos(i.g_1)) * (1/cos(i.theta_i1)) * (1/cos(i.theta_v1)) / 2',
      dict);
  return local.select(['k_geo', 'k_vol']);
};

/* Adjusts the BRDFs of Landsat images to nadir observations. */
var adjustBRDF = function(image, sunZen, viewZen, sunAz, viewAz, debug) {
  var relativeAz = viewAz.subtract(sunAz);

  var viewZenNorm = deg2rad(0);
  var sunZenNorm = deg2rad(ee.Image.pixelLonLat().select('latitude').polynomial(
          [31.0076, -0.1272, 0.01187, 2.4e-5, -9.48e-7, -1.95e-9, 6.15e-11]));
  var relativeAzNorm = deg2rad(180);

  // ======== BRDF parameters  ========
  //     band   1       2       3       4       5       7
  var dict = {
    f_iso: [0.0774, 0.1306, 0.1690, 0.3093, 0.3430, 0.2658],
    f_vol: [0.0372, 0.0580, 0.0574, 0.1535, 0.1154, 0.0639],
    f_geo: [0.0079, 0.0178, 0.0227, 0.0330, 0.0453, 0.0387],
    pi: Math.PI
  };

  // ======== calculate the kernel ========
  var sensor = kernel(sunZen, viewZen, relativeAz);
  var norm = kernel(sunZenNorm, viewZenNorm, relativeAzNorm);

  // ======== calculate correcting parameter  ========
  var formula = 'b("k_geo") * f_geo + b("k_vol") * f_vol + f_iso';
  var P1 = norm.expression(formula, dict);
  var P2 = sensor.expression(formula, dict);

  norm = addBandSuffix(norm, '_norm');
  sensor = addBandSuffix(sensor, '_sensor');
  var cFactor = addBandSuffix(P1.divide(P2), '_cFactor');
  var corrected = image.multiply(cFactor); // corrected reflectance

  if (debug) {
    corrected = corrected
        .addBands(norm)
        .addBands(sensor)
        .addBands(addBandSuffix(P1, '_brdf_norm'))
        .addBands(addBandSuffix(P2, '_brdf_sensor'))
        .addBands(cFactor);
  }
  return corrected;
};

/**
 * Apply a BRDF correction to a Landsat image.
 * This assumes the image's bands are named using the 'common' naming scheme.
 *
 * @param {!Image} image The image to correct.  According to the Landsat convention, this
 * function assumes that the northern-most point in the footprint is the "northwest" corner.
 * @param {boolean} debug If set, all the intermediate calculations are also returned as bands.
 * @return {Image} The original image with the corrected bands overwriting the originals.
 */
var applyBrdfCorrection = function(image, debug) {
  var args = NamedArgs.extractFromFunction(applyBrdfCorrection, arguments);
  image = args.image;
  debug = args.debug;
  var bands = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
  var solar = solarPosition(image.date());
  var view = viewAngles(ee.Geometry(image.get('system:footprint')));
  var result = adjustBRDF(image.select(bands),
      solar.select('sunZen'),
      view.select('viewZen'),
      solar.select('sunAz'),
      view.select('viewAz'), debug);
  return image.addBands(result, null, true);
};

exports.findCorners = findCorners;
exports.viewAngles = viewAngles;
exports.solarPosition = solarPosition;
exports.applyBrdfCorrection = applyBrdfCorrection;
