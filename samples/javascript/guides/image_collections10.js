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
 *     from 'Collection Visualization' page
 */


// #############################################################################
// ### Filtering ###
// #############################################################################



// [START earthengine__image_collections10__filtering01]
var s2col = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterDate('2018-01-01', '2019-01-01');
// [END earthengine__image_collections10__filtering01]


// #############################################################################


// [START earthengine__image_collections10__filtering02]
var s2col = ee.ImageCollection('COPERNICUS/S2_SR')
  .filter(ee.Filter.calendarRange(171, 242, 'day_of_year'));
// [END earthengine__image_collections10__filtering02]


// #############################################################################


// [START earthengine__image_collections10__filtering03]
var s2col = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(ee.Geometry.Point(-122.1, 37.2));
// [END earthengine__image_collections10__filtering03]


// #############################################################################


// [START earthengine__image_collections10__filtering04]
var s2col = ee.ImageCollection('COPERNICUS/S2_SR')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 50));
// [END earthengine__image_collections10__filtering04]


// #############################################################################


// [START earthengine__image_collections10__filtering05]
var s2col = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterDate('2018-01-01', '2019-01-01')
  .filterBounds(ee.Geometry.Point(-122.1, 37.2))
  .filter('CLOUDY_PIXEL_PERCENTAGE < 50');
// [END earthengine__image_collections10__filtering05]



// #############################################################################
// ### Compositing ###
// #############################################################################



// [START earthengine__image_collections10__compositing01]
var ndviCol = ee.ImageCollection('MODIS/006/MOD13A2')
  .filterDate('2018-01-01', '2019-01-01')
  .select('NDVI');
// [END earthengine__image_collections10__compositing01]


// #############################################################################


// [START earthengine__image_collections10__compositing02]
// Make a day-of-year sequence from 1 to 365 with a 16-day step.
var doyList = ee.List.sequence(1, 365, 16);

// Import a MODIS NDVI collection.
var ndviCol = ee.ImageCollection('MODIS/006/MOD13A2').select('NDVI');

// Map over the list of days to build a list of image composites.
var ndviCompList = doyList.map(function(startDoy) {
  // Ensure that startDoy is a number.
  startDoy = ee.Number(startDoy);

  // Filter images by date range; starting with the current startDate and
  // ending 15 days later. Reduce the resulting image collection by median.
  return ndviCol
    .filter(ee.Filter.calendarRange(startDoy, startDoy.add(15), 'day_of_year'))
    .reduce(ee.Reducer.median());
});

// Convert the image List to an ImageCollection.
var ndviCompCol = ee.ImageCollection.fromImages(ndviCompList);
// [END earthengine__image_collections10__compositing02]


// #############################################################################


// [START earthengine__image_collections10__compositing03]
// Assemble a collection of Landsat surface reflectance images for a given
// region and day-of-year range.
var lsCol = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
  .filterBounds(ee.Geometry.Point(-122.9, 43.6))
  .filter(ee.Filter.dayOfYear(182, 243))
  // Add the observation year as a property to each image.
  .map(function(img) {
    return img.set('year', ee.Image(img).date().get('year'));
  });


// Define a function to scale the data and mask unwanted pixels.
function maskL457sr(image) {
  // Bit 0 - Fill
  // Bit 1 - Dilated Cloud
  // Bit 2 - Unused
  // Bit 3 - Cloud
  // Bit 4 - Cloud Shadow
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);

  // Apply the scaling factors to the appropriate bands.
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBand = image.select('ST_B6').multiply(0.00341802).add(149.0);

  // Replace the original bands with the scaled ones and apply the masks.
  return image.addBands(opticalBands, null, true)
      .addBands(thermalBand, null, true)
      .updateMask(qaMask)
      .updateMask(saturationMask);
}

// Define a list of unique observation years from the image collection.
var years = ee.List(lsCol.aggregate_array('year')).distinct().sort();

// Map over the list of years to build a list of annual image composites.
var lsCompList = years.map(function(year) {
  return lsCol
    // Filter image collection by year.
    .filterMetadata('year', 'equals', year)
    // Apply cloud mask.
    .map(maskL457sr)
    // Reduce image collection by median.
    .reduce(ee.Reducer.median())
    // Set composite year as an image property.
    .set('year', year);
});

// Convert the image List to an ImageCollection.
var lsCompCol = ee.ImageCollection.fromImages(lsCompList);
// [END earthengine__image_collections10__compositing03]


// #############################################################################


// [START earthengine__image_collections10__compositing04]
// Assemble a collection of Landsat surface reflectance images for a given
// region and day-of-year range.
var lsCol = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
  .filterBounds(ee.Geometry.Point(-122.9, 43.6))
  .filter(ee.Filter.dayOfYear(182, 243))
  // Add the observation year as a property to each image.
  .map(function(img) {
    return img.set('year', ee.Image(img).date().get('year'));
  });

// Make a distinct year collection; one image representative per year.
var distinctYears = lsCol.distinct('year').sort('year');

// Define a join filter; one-to-many join on ‘year’ property.
var filter = ee.Filter.equals({leftField: 'year', rightField: 'year'});

// Define a join.
var join = ee.Join.saveAll('year_match');

// Apply the join; results in 'year_match' property being added to each distinct
// year representative image. The list includes all images in the collection
// belonging to the respective year.
var joinCol = join.apply(distinctYears, lsCol, filter);

// Define a function to scale the data and mask unwanted pixels.
function maskL457sr(image) {
  // Bit 0 - Fill
  // Bit 1 - Dilated Cloud
  // Bit 2 - Unused
  // Bit 3 - Cloud
  // Bit 4 - Cloud Shadow
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);

  // Apply the scaling factors to the appropriate bands.
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBand = image.select('ST_B6').multiply(0.00341802).add(149.0);

  // Replace the original bands with the scaled ones and apply the masks.
  return image.addBands(opticalBands, null, true)
      .addBands(thermalBand, null, true)
      .updateMask(qaMask)
      .updateMask(saturationMask);
}

// Map over the distinct years collection to build a list of annual image
// composites.
var lsCompList = joinCol.map(function(img) {
  // Get the list of images belonging to the given year.
  return ee.ImageCollection.fromImages(img.get('year_match'))
    // Apply cloud mask.
    .map(maskL457sr)
    // Reduce image collection by median.
    .reduce(ee.Reducer.median())
    // Set composite year as an image property.
    .copyProperties(img, ['year']);
});

// Convert the image List to an ImageCollection.
var lsCompCol = ee.ImageCollection(lsCompList);
// [END earthengine__image_collections10__compositing04]


// #############################################################################


// [START earthengine__image_collections10__compositing05]
var lsCol = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate('2017-01-01', '2019-01-01')
  .filter('WRS_PATH == 38 && (WRS_ROW == 28 || WRS_ROW == 29)')
  .map(function(img) {
    var date = img.date().format('YYYY-MM-dd');
    return img.set('date', date);
  });

var distinctDates = lsCol.distinct('date').sort('date');
var filter = ee.Filter.equals({leftField: 'date', rightField: 'date'});
var join = ee.Join.saveAll('date_match');
var joinCol = join.apply(distinctDates, lsCol, filter);

var lsColMos = ee.ImageCollection(joinCol.map(function(col) {
  return ee.ImageCollection.fromImages(col.get('date_match')).mosaic();
}));
// [END earthengine__image_collections10__compositing05]



// #############################################################################
// ### Sorting ###
// #############################################################################



// [START earthengine__image_collections10__sorting01]
var s2col = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(ee.Geometry.Point(-122.1, 37.2))
  .sort('system:time_start');
// [END earthengine__image_collections10__sorting01]


// #############################################################################


// [START earthengine__image_collections10__sorting02]
var s2col = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(ee.Geometry.Point(-122.1, 37.2))
  .sort('CLOUDY_PIXEL_PERCENTAGE');
// [END earthengine__image_collections10__sorting02]


// #############################################################################


// [START earthengine__image_collections10__sorting03]
// Define an area of interest geometry.
var aoi = ee.Geometry.Point(-122.1, 37.2).buffer(1e4);

// Filter MODIS NDVI image collection by a date range.
var ndviCol = ee.ImageCollection('MODIS/006/MOD13A1')
  .filterDate('2018-01-01', '2019-01-01')
  .select('NDVI')
  // Map over the image collection to calculate regional mean NDVI and add
  // the result to each image as a property.
  .map(function(img) {
    var meanNdvi = img.reduceRegion({
      reducer: ee.Reducer.mean(), geometry: aoi, scale: 500});
    return img.set('meanNdvi', meanNdvi.get('NDVI'));
  })
  // Sort the collection by descending regional mean NDVI.
  .sort('meanNdvi', false);
// [END earthengine__image_collections10__sorting03]



// #############################################################################
// ### Image visualization
// #############################################################################



// [START earthengine__image_collections10__imageVis01]
// Import SRTM global elevation model.
var demImg = ee.Image('USGS/SRTMGL1_003');

// Define a rectangular area of interest.
var aoi = ee.Geometry.Polygon(
  [[
    [-103.84153083119054, 49.083004219142886],
    [-103.84153083119054, 25.06838270664608],
    [-85.64817145619054, 25.06838270664608],
    [-85.64817145619054, 49.083004219142886]
  ]],
  null, false);

// Calculate the 2nd and 98th percentile elevation values from rescaled (to
// 500m) pixels intersecting the area of interest. A Dictionary is returned.
var percentClip = demImg.reduceRegion({
  reducer: ee.Reducer.percentile([2, 98]),
  geometry: aoi,
  scale: 500,
  maxPixels: 3e7
});

// Print the regional 2nd and 98th percentile elevation values. Get the
// dictionary keys and use them to get the values for each percentile summary.
var keys = percentClip.keys();
print('Set vis min to:', ee.Number(percentClip.get(keys.get(0))).round());
print('Set vis max to:', ee.Number(percentClip.get(keys.get(1))).round());
// [END earthengine__image_collections10__imageVis01]


// #############################################################################


// [START earthengine__image_collections10__imageVis02]
// Filter MODIS NDVI image collection by a date range.
var ndviCol = ee.ImageCollection('MODIS/006/MOD13A1')
  .filterDate('2018-01-01', '2019-01-01')
  .select('NDVI');

// Define visualization arguments.
var visArgs = {
  min: 0,
  max: 9000,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ]
};

// Define a function to convert an image to an RGB visualization image and copy
// properties from the original image to the RGB image.
var visFun = function(img) {
  return img.visualize(visArgs).copyProperties(img, img.propertyNames());
};

// Map over the image collection to convert each image to an RGB visualization
// using the previously defined visualization function.
var ndviColVis = ndviCol.map(visFun);
// [END earthengine__image_collections10__imageVis02]


// #############################################################################


// [START earthengine__image_collections10__imageVis03]
// Assemble a collection of Sentinel-2 surface reflectance images for a given
// region and date range.
var s2col = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(ee.Geometry.Point(-96.9037, 48.0395))
  .filterDate('2019-06-01', '2019-10-01');

// Define visualization arguments.
var visArgs = {bands: ['B11', 'B8', 'B3'], min: 300, max: 3500};

// Define a function to convert an image to an RGB visualization image and copy
// properties from the original image to the RGB image.
var visFun = function(img) {
  return img.visualize(visArgs).copyProperties(img, img.propertyNames());
};

// Map over the image collection to convert each image to an RGB visualization
// using the previously defined visualization function.
var s2colVis = s2col.map(visFun);
// [END earthengine__image_collections10__imageVis03]



// #############################################################################
// ### Video thumb ###
// #############################################################################



// [START earthengine__image_collections10__videoThumb01]
// Define an area of interest geometry with a global non-polar extent.
var aoi = ee.Geometry.Polygon(
  [[[-179.0, 78.0], [-179.0, -58.0], [179.0, -58.0], [179.0, 78.0]]], null,
  false);

// Import hourly predicted temperature image collection for northern winter
// solstice. Note that predictions extend for 384 hours; limit the collection
// to the first 24 hours.
var tempCol = ee.ImageCollection('NOAA/GFS0P25')
  .filterDate('2018-12-22', '2018-12-23')
  .limit(24)
  .select('temperature_2m_above_ground');

// Define arguments for animation function parameters.
var videoArgs = {
  dimensions: 768,
  region: aoi,
  framesPerSecond: 7,
  crs: 'EPSG:3857',
  min: -40.0,
  max: 35.0,
  palette: ['blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

// Print the animation to the console as a ui.Thumbnail using the above defined
// arguments. Note that ui.Thumbnail produces an animation when the first input
// is an ee.ImageCollection instead of an ee.Image.
print(ui.Thumbnail(tempCol, videoArgs));

// Alternatively, print a URL that will produce the animation when accessed.
print(tempCol.getVideoThumbURL(videoArgs));
// [END earthengine__image_collections10__videoThumb01]



// #############################################################################
// ### Filmstrip ###
// #############################################################################



// [START earthengine__image_collections10__filmstrip01]
// Define an area of interest geometry with a global non-polar extent.
var aoi = ee.Geometry.Polygon(
  [[[-179.0, 78.0], [-179.0, -58.0], [179.0, -58.0], [179.0, 78.0]]], null,
  false);

// Import hourly predicted temperature image collection for northern winter
// solstice. Note that predictions extend for 384 hours; limit the collection
// to the first 24 hours.
var tempCol = ee.ImageCollection('NOAA/GFS0P25')
  .filterDate('2018-12-22', '2018-12-23')
  .limit(24)
  .select('temperature_2m_above_ground');

// Define arguments for the getFilmstripThumbURL function parameters.
var filmArgs = {
  dimensions: 128,
  region: aoi,
  crs: 'EPSG:3857',
  min: -40.0,
  max: 35.0,
  palette: ['blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

// Print a URL that will produce the filmstrip when accessed.
print(tempCol.getFilmstripThumbURL(filmArgs));
// [END earthengine__image_collections10__filmstrip01]



// #############################################################################
// ### Advanced techniques ###
// #############################################################################



// [START earthengine__image_collections10__advancedTechniques01]
// Import hourly predicted temperature image collection for northern winter
// solstice. Note that predictions extend for 384 hours; limit the collection
// to the first 24 hours.
var tempCol = ee.ImageCollection('NOAA/GFS0P25')
  .filterDate('2018-12-22', '2018-12-23')
  .limit(24)
  .select('temperature_2m_above_ground');

// Define visualization arguments to control the stretch and color gradient
// of the data.
var visArgs = {
  min: -40.0,
  max: 35.0,
  palette: ['blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

// Convert each image to an RGB visualization image by mapping the visualize
// function over the image collection using the arguments defined previously.
var tempColVis = tempCol.map(function(img) {
  return img.visualize(visArgs);
});

// Import country features and filter to South American countries.
var southAmCol = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filterMetadata('wld_rgn', 'equals', 'South America');

// Define animation region (South America with buffer).
var southAmAoi = ee.Geometry.Rectangle({
  coords: [-103.6, -58.8, -18.4, 17.4], geodesic: false});
// [END earthengine__image_collections10__advancedTechniques01]


// #############################################################################


// [START earthengine__image_collections10__overlays01]
// Define an empty image to paint features to.
var empty = ee.Image().byte();

// Paint country feature edges to the empty image.
var southAmOutline = empty
  .paint({featureCollection: southAmCol, color: 1, width: 1})
  // Convert to an RGB visualization image; set line color to black.
  .visualize({palette: '000000'});

// Map a blend operation over the temperature collection to overlay the country
// border outline image on all collection images.
var tempColOutline = tempColVis.map(function(img) {
  return img.blend(southAmOutline);
});

// Define animation arguments.
var videoArgs = {
  dimensions: 768,
  region: southAmAoi,
  framesPerSecond: 7,
  crs: 'EPSG:3857'
};

// Display the animation.
print(ui.Thumbnail(tempColOutline, videoArgs));
// [END earthengine__image_collections10__overlays01]


// #############################################################################


// [START earthengine__image_collections10__overlays02]
// Define an empty image to paint features to.
var empty = ee.Image().byte();

// Paint country feature edges to the empty image.
var southAmOutline = empty
  .paint({featureCollection: southAmCol, color: 1, width: 1})
  // Convert to an RGB visualization image; set line color to black.
  .visualize({palette: '000000'});

// Map a blend operation over the temperature collection to overlay the country
// border outline image on all collection images.
var tempColOutline = tempColVis.map(function(img) {
  return img.blend(southAmOutline);
});

// Define a partially opaque grey RGB image to dull the underlying image when
// blended as an overlay.
var dullLayer = ee.Image.constant(175).visualize({
  opacity: 0.6, min: 0, max: 255, forceRgbOutput: true});

// Map a two-part blending operation over the country outline temperature
// collection for final styling.
var finalVisCol = tempColOutline.map(function(img) {
  return img
    // Blend the dulling layer with the given country outline temperature image.
    .blend(dullLayer)
    // Blend a clipped copy of the country outline temperature image with the
    // dulled background image.
    .blend(img.clipToCollection(southAmCol));
});

// Define animation arguments.
var videoArgs = {
  dimensions: 768,
  region: southAmAoi,
  framesPerSecond: 7,
  crs: 'EPSG:3857'
};

// Display the animation.
print(ui.Thumbnail(finalVisCol, videoArgs));
// [END earthengine__image_collections10__overlays02]


// #############################################################################


// [START earthengine__image_collections10__overlays03]
// Define a hillshade layer from SRTM digital elevation model.
var hillshade = ee.Terrain.hillshade(ee.Image('USGS/SRTMGL1_003')
  // Exaggerate the elevation to increase contrast in hillshade.
  .multiply(100))
  // Clip the DEM by South American boundary to clean boundary between
  // land and ocean.
  .clipToCollection(southAmCol);

// Map a blend operation over the temperature collection to overlay a partially
// opaque temperature layer on the hillshade layer.
var finalVisCol = tempColVis.map(function(img) {
  return hillshade
    .blend(img.clipToCollection(southAmCol).visualize({opacity: 0.6}));
});

// Define animation arguments.
var videoArgs = {
  dimensions: 768,
  region: southAmAoi,
  framesPerSecond: 7,
  crs: 'EPSG:3857'
};

// Display the animation.
print(ui.Thumbnail(finalVisCol, videoArgs));
// [END earthengine__image_collections10__overlays03]


// #############################################################################


// [START earthengine__image_collections10__transitions01]
// Define an area of interest geometry with a global non-polar extent.
var aoi = ee.Geometry.Polygon(
  [[[-179.0, 78.0], [-179.0, -58.0], [179.0, -58.0], [179.0, 78.0]]], null,
  false);

// Import hourly predicted temperature image collection.
var temp = ee.ImageCollection('NOAA/GFS0P25')

// Define a northern summer solstice temperature image.
var summerSolTemp = temp
  .filterDate('2018-06-21', '2018-06-22')
  .filterMetadata('forecast_hours', 'equals', 12)
  .first()
  .select('temperature_2m_above_ground');

// Define a northern winter solstice temperature image.
var winterSolTemp = temp
  .filterDate('2018-12-22', '2018-12-23')
  .filterMetadata('forecast_hours', 'equals', 12)
  .first()
  .select('temperature_2m_above_ground');

// Combine the solstice images into a collection.
var tempCol = ee.ImageCollection([
  summerSolTemp.set('season', 'summer'),
  winterSolTemp.set('season', 'winter')
]);

// Import international boundaries feature collection.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Define visualization arguments.
var visArgs = {
  min: -40.0,
  max: 35.0,
  palette: ['blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

// Convert the image data to RGB visualization images.
// The clip and unmask combination sets ocean pixels to black.
var tempColVis = tempCol.map(function(img) {
  return img
    .visualize(visArgs)
    .clipToCollection(countries)
    .unmask(0)
    .copyProperties(img, img.propertyNames());
});
// [END earthengine__image_collections10__transitions01]


// #############################################################################


// [START earthengine__image_collections10__transitions02]
// Define arguments for animation function parameters.
var videoArgs = {
  dimensions: 768,
  region: aoi,
  framesPerSecond: 2,
  crs: 'EPSG:3857'
};

// Display animation to the Code Editor console.
print(ui.Thumbnail(tempColVis, videoArgs));
// [END earthengine__image_collections10__transitions02]


// #############################################################################


// [START earthengine__image_collections10__transitions03]
// Define a sequence of decreasing opacity increments. Note that opacity cannot
// be 0, so near 1 and 0 are used. Near 1 is needed because a compliment is
// calculated in a following step that can result in 0 if 1 is an element of the
// list.
var opacityList = ee.List.sequence({start: 0.99999, end: 0.00001, count: 20});

// Filter the summer and winter solstice images from the collection and set as
// image objects.
var summerImg = tempColVis.filter(ee.Filter.eq('season', 'summer')).first();
var winterImg = tempColVis.filter(ee.Filter.eq('season', 'winter')).first();

// Map over the list of opacity increments to iteratively adjust the opacity of
// the two solstice images. Returns a list of images.
var imgList = opacityList.map(function(opacity) {
  var opacityCompliment = ee.Number(1).subtract(ee.Number(opacity));
  var winterImgFade = winterImg.visualize({opacity: opacity});
  var summerImgFade = summerImg.visualize({opacity: opacityCompliment});
  return summerImgFade.blend(winterImgFade).set('opacity', opacity);
});

// Convert the image list to an image collection; the forward phase.
var fadeForward = ee.ImageCollection.fromImages(imgList);

// Make a copy of the collection that is sorted by ascending opacity to
// represent the reverse phase.
var fadeBackward = fadeForward.sort({property: 'opacity'});

// Merge the forward and reverse phase frame collections.
var fadeCol = fadeForward.merge(fadeBackward);

// Define animation arguments.
var videoArgs = {
  dimensions: 768,
  region: aoi,
  framesPerSecond: 25,
  crs: 'EPSG:3857'
};

// Display the animation.
print(ui.Thumbnail(fadeCol, videoArgs));
// [END earthengine__image_collections10__transitions03]


// #############################################################################


// [START earthengine__image_collections10__transitions04]
// Define a sequence of longitude increments. Start and end are defined by the
// min and max longitude of the feature to be provided to the region parameter
// of the animation arguments dictionary.
var lonSeq = ee.List.sequence({start: -179, end: 179, count: 20});

// Define a longitude image.
var longitude = ee.Image.pixelLonLat().select('longitude');

// Filter the summer and winter solstice images from the collection and set as
// image objects.
var summerImg = tempColVis.filter(ee.Filter.eq('season', 'summer')).first();
var winterImg = tempColVis.filter(ee.Filter.eq('season', 'winter')).first();

// Map over the list of longitude increments to iteratively adjust the mask
// (opacity) of the overlying image layer. Returns a list of images.
var imgList = lonSeq.map(function(lon) {
  lon = ee.Number(lon);
  var mask = longitude.gt(lon);
  return summerImg.blend(winterImg.updateMask(mask)).set('lon', lon);
});

// Convert the image list to an image collection; concealing phase.
var sliderColForward = ee.ImageCollection.fromImages(imgList);

// Make a copy of the collection that is sorted by descending longitude to
// represent the revealing phase.
var sliderColbackward = sliderColForward
  .sort({property: 'lon', ascending: false});

// Merge the forward and backward phase frame collections.
var sliderCol = sliderColForward.merge(sliderColbackward);

// Define animation arguments.
var videoArgs = {
  dimensions: 768,
  region: aoi,
  framesPerSecond: 25,
  crs: 'EPSG:3857'
};

// Display the animation.
print(ui.Thumbnail(sliderCol, videoArgs));
// [END earthengine__image_collections10__transitions04]
