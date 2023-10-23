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

# [START earthengine__apidocs__ee_image_cliptocollection]
# A digital elevation model.
dem = ee.Image('NASA/NASADEM_HGT/001')

# A FeatureCollection defining Southeast Asia boundary.
fc = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017').filter(
    'wld_rgn == "SE Asia"'
)

# Clip the DEM by the Southeast Asia boundary FeatureCollection.
dem_clip = dem.clipToCollection(fc)
display('Clipped image retains metadata and band names', dem_clip)

# Add layers to the map.
m = geemap.Map()
m.set_center(110.64, 9.16, 4)
m.add_layer(dem, {'bands': 'elevation', 'min': 0, 'max': 2500}, 'Original DEM')
m.add_layer(fc, {'color': 'blue'}, 'FeatureCollection')
m.add_layer(
    dem_clip,
    {
        'bands': 'elevation',
        'min': 0,
        'max': 2500,
        'palette': ['green', 'yellow', 'brown'],
    },
    'Clipped DEM',
)
m
# [END earthengine__apidocs__ee_image_cliptocollection]
