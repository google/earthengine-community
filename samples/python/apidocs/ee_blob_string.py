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

# [START earthengine__apidocs__ee_blob_string]
# Parse a SpatioTemporal Asset Catalog (STAC) entry from Google Cloud
# Storage (GCS). This is a non-traditional use of ee.Blob.
url = 'gs://ee-docs-demos/vector/geojson/point.json'
blob = ee.Blob(url)
entry = ee.Dictionary(blob.string().decodeJSON())
print(entry.getInfo())  # Point (1.00, 2.00)...
print(entry.get('a_field').getInfo())  # "a demo field"
# [END earthengine__apidocs__ee_blob_string]
