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

# [START earthengine__apidocs__export_table_todrive]
# A Sentinel-2 surface reflectance image.
img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG')
m = geemap.Map()
m.set_center(-122.359, 37.428, 9)
m.add_ee_layer(
    img, {'bands': ['B11', 'B8', 'B3'], 'min': 100, 'max': 3500}, 'img'
)

# Sample the image at 20 m scale, a point feature collection is returned.
samp = img.sample(scale=20, numPixels=50, geometries=True)
m.add_ee_layer(samp, {'color': 'white'}, 'samp')
display(m)
display('Image sample feature collection', samp)

# Export the image sample feature collection to Drive as a CSV file.
task = ee.batch.Export.table.toDrive(
    collection=samp,
    description='image_sample_demo_csv',
    folder='earth_engine_demos',
    fileFormat='CSV',
)
task.start()

# Export a subset of collection properties: three bands and the geometry
# as GeoJSON.
task = ee.batch.Export.table.toDrive(
    collection=samp,
    description='image_sample_demo_prop_subset',
    folder='earth_engine_demos',
    fileFormat='GeoJSON',
    selectors=['B8', 'B11', 'B12', '.geo'],
)
task.start()

# Export the image sample feature collection to Drive as a shapefile.
task = ee.batch.Export.table.toDrive(
    collection=samp,
    description='image_sample_demo_shp',
    folder='earth_engine_demos',
    fileFormat='SHP',
)
task.start()
# [END earthengine__apidocs__export_table_todrive]
