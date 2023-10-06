# Copyright 2023 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_image_sampleregions]
# A Sentinel-2 surface reflectance image.
img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG')
m = geemap.Map()
m.set_center(-122.503881, 37.765588, 18)
m.add_ee_layer(
    img, {'bands': ['B11', 'B8', 'B3'], 'min': 100, 'max': 4500}, 'img'
)
display(m)

# A feature collection with two polygon regions each intersecting 36
# pixels at 10 m scale.
fc_polygon = ee.FeatureCollection([
    ee.Feature(
        ee.Geometry.Rectangle(
            -122.50620929, 37.76502806, -122.50552264, 37.76556663
        ),
        {'id': 0},
    ),
    ee.Feature(
        ee.Geometry.Rectangle(
            -122.50530270, 37.76565568, -122.50460533, 37.76619425
        ),
        {'id': 1},
    ),
])
m.add_ee_layer(fc_polygon, {'color': 'yellow'}, 'fc_polygon')

fc_polygon_samp = img.sampleRegions(
    collection=fc_polygon, scale=10, geometries=True
)
# Note that 7 pixels are missing from the sample. If a pixel contains a masked
# band value it will be excluded from the sample. In this case, the TCI_B band
# is masked for each unsampled pixel.
display('A feature per pixel (at given scale) in each region', fc_polygon_samp)
m.add_ee_layer(fc_polygon_samp, {'color': 'purple'}, 'fc_polygon_samp')

# A feature collection with two points intersecting two different pixels.
# This example is included to show the behavior for point geometries. In
# practice, if the feature collection is all points, ee.Image.reduceRegions
# should be used instead to save memory.
fc_point = ee.FeatureCollection([
    ee.Feature(ee.Geometry.Point([-122.50309256, 37.76605006]), {'id': 0}),
    ee.Feature(ee.Geometry.Point([-122.50344661, 37.76560903]), {'id': 1}),
])
m.add_ee_layer(fc_point, {'color': 'cyan'}, 'fc_point')

fc_point_samp = img.sampleRegions(collection=fc_point, scale=10)
display('A feature per point', fc_point_samp)
# [END earthengine__apidocs__ee_image_sampleregions]
