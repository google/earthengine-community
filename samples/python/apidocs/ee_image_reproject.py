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

# [START earthengine__apidocs__ee_image_reproject]
# Use of ee.Image.reproject is rarely needed and should generally be avoided.
# Defining the projection and scale of analysis should be handled by "scale",
# "crs", and "crsTransform" parameters whenever they are offered by a function.
# It is occasionally useful for forcing computation or visualization at a
# desired scale and projection when alternative methods are not available. In
# this example it is used to compute and visualize terrain slope from a DEM
# composite.

# Calculate mean elevation from two DEM datasets. The resulting composite
# image has a default CRS of WGS84 with 1 degree pixels.
dem_1 = ee.Image('NASA/NASADEM_HGT/001').select('elevation')
dem_2 = ee.Image('CGIAR/SRTM90_V4').select('elevation')
dem_mean = ee.ImageCollection([dem_1, dem_2]).mean()

# Display the DEMs on the map, note that they all render as expected.
dem_vis_params = {'min': 500, 'max': 2500}
m = geemap.Map()
m.set_center(-123.457, 47.815, 11)
m.add_layer(dem_1, dem_vis_params, 'DEM 1')
m.add_layer(dem_2, dem_vis_params, 'DEM 2')
m.add_layer(dem_mean, dem_vis_params, 'DEM composite')

# Calculate terrain slope from the composite DEM (WGS84, 1 degree pixel scale).
dem_comp_slope = ee.Terrain.slope(dem_mean)

# Because the composite has 1 degree pixel scale, the slope calculation
# is essenstially meaningless and difficult to even display (you may need to
# zoom out to see the individual 1 degree pixels).
m.add_layer(dem_comp_slope, {'min': 0, 'max': 0.3}, 'Slope')

# We can use ee.Image.reproject to force the slope calculation and display
# the result with a reasonable scale of 30 m on WGS84 CRS, for example.
slope_scale = ee.Terrain.slope(dem_mean.reproject(crs='EPSG:4326', scale=30))
m.add_layer(slope_scale, {'min': 0, 'max': 45}, 'Slope w/ CRS and scale')

# To more precisely control the reprojection, you can use the "crsTransform"
# parameter instead of the "scale" parameter or set the projection according to
# a reference image. For example, here the input composite image for the slope
# function is set to match the grid spacing and alignment of the NASADEM image.
nasadem_proj = dem_1.projection()
dem_mean_reproj = dem_mean.reproject(nasadem_proj)
slope_ref_proj = ee.Terrain.slope(dem_mean_reproj)
m.add_layer(slope_ref_proj, {'min': 0, 'max': 45}, 'Slope w/ reference proj')
display('Reference projection', nasadem_proj)
display('DEM composite projection', dem_mean_reproj.projection())

# An alternative method for changing the projection of image composites
# (not accepting the default WGS84 CRS with 1 degree pixel scale) is to
# explicitly set the default projection using ee.Image.setDefaultProjection,
# which will not force resampling, like ee.Image.reproject will.
dem_mean_proj = (
    ee.ImageCollection([dem_1, dem_2]).mean().setDefaultProjection(nasadem_proj)
)
slope_proj = ee.Terrain.slope(dem_mean_proj)
m.add_layer(
    slope_proj, {'min': 0, 'max': 45}, 'slope w/ default projection set'
)
m
# [END earthengine__apidocs__ee_image_reproject]
