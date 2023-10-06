# Copyright 2022 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License")
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Examples for /earth-engine/cloud/api_monitoring page."""

# [START earthengine__cloud_api_monitoring__workload_tags]
# Authenticate, then initialize with your Cloud Project.
ee.Initialize(project='your-project')

# Set a default workload tag.
ee.data.setDefaultWorkloadTag('landsat-compositing')
composite = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate('2020-01-01', '2021-01-01')
    .median()
)

# Set a workload tag for export.
ee.data.setWorkloadTag('export-jobs')
ee.batch.Export.image.toAsset(composite).start()
ee.data.resetWorkloadTag()

# Alternatively, use a workload tag with with.
with ee.data.workloadTagContext('export-jobs'):
  ee.batch.Export.image.toAsset(composite).start()
# [END earthengine__cloud_api_monitoring__workload_tags]
