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

# [START earthengine__apidocs__ee_image_sample]
# Demonstrate extracting pixels from an image as features with
# ee.Image.sample(), and show how the features are aligned with the pixels.

# An image with one band of elevation data.
image = ee.Image('CGIAR/SRTM90_V4')
vis_min = 1620
vis_max = 1650
m = geemap.Map()
m.add_ee_layer(image, {'min': vis_min, 'max': vis_max}, 'SRTM')

# Region to sample.
region = ee.Geometry.Polygon(
    [[
        [-110.006, 40.002],
        [-110.006, 39.999],
        [-109.995, 39.999],
        [-109.995, 40.002],
    ]],
    None,
    False,
)
# Show region on the map.
m.set_center(-110, 40, 16)

m.add_ee_layer(ee.FeatureCollection([region]).style(color='00FF0022'))

# Perform sampling convert image pixels to features.
samples = image.sample(
    region=region,
    # Default (False) is no geometries in the output.
    # When set to True, each feature has a Point geometry at the center of the
    # image pixel.
    geometries=True,
    # The scale is not specified, so the resolution of the image will be used,
    # and there is a feature for every pixel. If we give a scale parameter, the
    # image will be resampled and there will be more or fewer features.
    #
    # scale=200,
)


def scale_point_size(feature):
  elevation = feature.getNumber('elevation')
  point_size = elevation.unitScale(vis_min, vis_max).multiply(15)
  feature.set('style', {'pointSize': point_size})
  return feature


# Visualize sample data using ee.FeatureCollection.style().
styled = samples.map(scale_point_size).style(
    color='000000FF',
    fillColor='00000000',
    styleProperty='style',
    neighborhood=6,  # increase to correctly draw large points
)
m.add_ee_layer(styled)
display(m)

# Each sample feature has a point geometry and a property named 'elevation'
# corresponding to the band named 'elevation' of the image. If there are
# multiple bands they will become multiple properties. This will print:
#
# geometry: Point (-110.01, 40.00)
# properties:
#   elevation: 1639
display(samples.first())
# [END earthengine__apidocs__ee_image_sample]
