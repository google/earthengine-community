# Copyright 2026 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_imagecollection_loadzarrv2array]
time_start = 1000000
time_end = 1000048

# Load a 2m temperature Zarr v2 array.
temperature = ee.ImageCollection.loadZarrV2Array(
    uri=(
        'gs://gcp-public-data-arco-era5/ar/'
        'full_37-1h-0p25deg-chunk-1.zarr-v3/2m_temperature/.zarray'
    ),
    proj='EPSG:4326',
    axis=0,
    starts=[time_start],
    ends=[time_end],
)

display(temperature)

vis_params = {
    'min': 220,
    'max': 350,
    'palette': [
        'darkblue',
        'blue',
        'cyan',
        'green',
        'yellow',
        'orange',
        'red',
        'darkred',
    ],
}
m.add_layer(temperature, vis_params, '2m Temperature')
m
# [END earthengine__apidocs__ee_imagecollection_loadzarrv2array]
