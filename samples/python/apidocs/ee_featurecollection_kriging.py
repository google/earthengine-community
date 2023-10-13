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

# [START earthengine__apidocs__ee_featurecollection_kriging]

# This example generates an interpolated surface using kriging from a
# FeatureCollection of random points that simulates a table of air temperature
# at ocean weather buoys.

# Average air temperature at 2m height for June, 2020.
img = ee.Image('ECMWF/ERA5/MONTHLY/202006').select(
    ['mean_2m_air_temperature'], ['tmean']
)

# Region of interest: South Pacific Ocean.
roi = ee.Geometry.Polygon(
    [[
        [-156.053, -16.240],
        [-156.053, -44.968],
        [-118.633, -44.968],
        [-118.633, -16.240],
    ]],
    None,
    False,
)

# Sample the mean June 2020 temperature surface at random points in the ROI.
tmean_fc = img.sample(region=roi, scale=25000, numPixels=50, geometries=True)

# Generate an interpolated surface from the points using kriging parameters
# are set according to interpretation of an unshown semivariogram. See section
# 2.1 of https://doi.org/10.14214/sf.369 for information on semivariograms.
tmean_img = tmean_fc.kriging(
    propertyName='tmean',
    shape='gaussian',
    range=2.8e6,
    sill=164,
    nugget=0.05,
    maxDistance=1.8e6,
    reducer=ee.Reducer.mean(),
)

# Display the results on the map.
m = geemap.Map()
m.set_center(-137.47, -30.47, 3)
m.add_layer(
    tmean_img,
    {'min': 279, 'max': 300, 'min': 279, 'max': 300},
    'Temperature (K)',
)
m
# [END earthengine__apidocs__ee_featurecollection_kriging]
