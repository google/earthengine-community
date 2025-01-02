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

"""Earth Engine Developer's Guide examples from 'Reducers - reduceRegions' section."""

# [START earthengine__reducers03__reduce_regions]
# Load input imagery: Landsat 7 5-year composite.
image = ee.Image('LANDSAT/LE7_TOA_5YEAR/2008_2012')

# Load a FeatureCollection of counties in Maine.
maine_counties = ee.FeatureCollection('TIGER/2016/Counties').filter(
    ee.Filter.eq('STATEFP', '23')
)

# Add reducer output to the Features in the collection.
maine_means_features = image.reduceRegions(
    collection=maine_counties, reducer=ee.Reducer.mean(), scale=30
)

# Print the first feature, to illustrate the result.
display(ee.Feature(maine_means_features.first()).select(image.bandNames()))
# [END earthengine__reducers03__reduce_regions]
