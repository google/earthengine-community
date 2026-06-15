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

# [START earthengine__apidocs__ee_featurecollection_filter]
# Load a collection of counties.
counties = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')

# Filter the collection to get Denver county.
denver_collection = counties.filter(ee.Filter.eq('ADM2_NAME', 'Denver'))

# Or you can use a string filter (equivalent to the above):
# denver_collection = counties.filter("ADM2_NAME == 'Denver'")

m = geemap.Map()
m.center_object(denver_collection, 9)
m.add_layer(denver_collection, None, 'Denver')
m
# [END earthengine__apidocs__ee_featurecollection_filter]
