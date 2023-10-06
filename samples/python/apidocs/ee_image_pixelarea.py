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

# [START earthengine__apidocs__ee_image_pixelarea]
# Create a pixel area image. Pixel values are square meters based on
# a given CRS and scale (or CRS transform).
pixel_area = ee.Image.pixelArea()

# The default projection is WGS84 with 1-degree scale.
display('Pixel area default projection', pixel_area.projection())

# When inspecting the output in the Code Editor map, the scale of analysis is
# determined by the zoom level. As you zoom in and out, you'll notice that the
# area of the clicked pixel changes. To set a specific pixel scale when
# performing a computation, provide an argument to the `scale` or
# `crsTransform` parameters whenever a function gives you the option.
m = geemap.Map()
m.add_ee_layer(pixel_area, None, 'Pixel area for inspection', False)

# The "area" band produced by the `pixel_area` function can be useful for
# calculating the area of a certain condition of another image. For example,
# here we use the sum reducer to determine the area above 2250m in the North
# Cascades ecoregion, according to a 30m digital elevation model.

# Import a DEM and subset the "elevation" band.
elev = ee.Image('NASA/NASADEM_HGT/001').select('elevation')

# Define a high elevation mask where pixels with elevation greater than 2250m
# are set to 1, otherwise 0.
high_elev_mask = elev.gt(2250)

# Apply the high elevation mask to the pixel area image.
high_elev_area = pixel_area.updateMask(high_elev_mask)

# Import an ecoregion feature collection and filter it by ecoregion name.
ecoregion = ee.FeatureCollection('RESOLVE/ECOREGIONS/2017').filter(
    'ECO_NAME == "North Cascades conifer forests"'
)

# Display the ecoregion and high elevation area.
m.set_center(-121.127, 48.389, 7)
m.add_ee_layer(ecoregion, None, 'North Cascades ecoregion')
m.add_ee_layer(
    high_elev_area.clip(ecoregion), {'palette': 'yellow'}, 'High elevation area'
)
display(m)

# Sum the area of high elevation pixels in the North Cascades ecoregion.
area = high_elev_area.reduceRegion(
    reducer=ee.Reducer.sum(),
    geometry=ecoregion,
    crs=elev.projection(),  # DEM coordinate reference system
    crsTransform=elev.projection().getInfo()['transform'],  # DEM grid alignment
    maxPixels=1e8,
)

# Fetch the summed area property from the resulting dictionary and convert
# square meters to square kilometers.
square_meters = area.getNumber('area')
square_kilometers = square_meters.divide(1e6)

display('Square meters above 2250m elevation', square_meters)
display('Square kilometers above 2250m elevation', square_kilometers)
# [END earthengine__apidocs__ee_image_pixelarea]
