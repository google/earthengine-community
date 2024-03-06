# Copyright 2024 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Earth Engine Developer's Guide examples from 'Sentinel 1' section."""

# [START earthengine__sentinel1__sentinel_composite]
# Load the Sentinel-1 ImageCollection, filter to Jun-Sep 2020 observations.
sentinel_1 = ee.ImageCollection('COPERNICUS/S1_GRD').filterDate(
    '2020-06-01', '2020-10-01'
)

# Filter the Sentinel-1 collection by metadata properties.
vv_vh_iw = (
    sentinel_1.filter(
        # Filter to get images with VV and VH dual polarization.
        ee.Filter.listContains('transmitterReceiverPolarisation', 'VV')
    )
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .filter(
        # Filter to get images collected in interferometric wide swath mode.
        ee.Filter.eq('instrumentMode', 'IW')
    )
)

# Separate ascending and descending orbit images into distinct collections.
vv_vh_iw_asc = vv_vh_iw.filter(
    ee.Filter.eq('orbitProperties_pass', 'ASCENDING')
)
vv_vh_iw_desc = vv_vh_iw.filter(
    ee.Filter.eq('orbitProperties_pass', 'DESCENDING')
)

# Calculate temporal means for various observations to use for visualization.
# Mean VH ascending.
vh_iw_asc_mean = vv_vh_iw_asc.select('VH').mean()
# Mean VH descending.
vh_iw_desc_mean = vv_vh_iw_desc.select('VH').mean()
# Mean VV for combined ascending and descending image collections.
vv_iw_asc_desc_mean = vv_vh_iw_asc.merge(vv_vh_iw_desc).select('VV').mean()
# Mean VH for combined ascending and descending image collections.
vh_iw_asc_desc_mean = vv_vh_iw_asc.merge(vv_vh_iw_desc).select('VH').mean()

# Display the temporal means for various observations, compare them.
m = geemap.Map()
m.add_layer(vv_iw_asc_desc_mean, {'min': -12, 'max': -4}, 'vv_iw_asc_desc_mean')
m.add_layer(
    vh_iw_asc_desc_mean, {'min': -18, 'max': -10}, 'vh_iw_asc_desc_mean'
)
m.add_layer(vh_iw_asc_mean, {'min': -18, 'max': -10}, 'vh_iw_asc_mean')
m.add_layer(vh_iw_desc_mean, {'min': -18, 'max': -10}, 'vh_iw_desc_mean')
m.set_center(-73.8719, 4.512, 9)  # Bogota, Colombia
m
# [END earthengine__sentinel1__sentinel_composite]
