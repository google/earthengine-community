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

# [START earthengine__apidocs__ee_reducer_count]
display(ee.List([]).reduce(ee.Reducer.count()))  # 0
display(ee.List([0]).reduce(ee.Reducer.count()))  # 1
display(ee.List([-1]).reduce(ee.Reducer.count()))  # 1
display(ee.List([1, None, 3]).reduce(ee.Reducer.count()))  # 2
display(ee.List([1, '', 3]).reduce(ee.Reducer.count()))  # 3

display(ee.Array([1, 0, 3]).reduce(ee.Reducer.count(), [0]))  # [3]

an_array = ee.Array([[1, 0, 3], [1, 2, 3]])
display(an_array.reduce(ee.Reducer.count(), [0]))  # [[2, 2, 2]]
display(an_array.reduce(ee.Reducer.count(), [1]))  # [[3], [3]]
display(an_array.reduce(ee.Reducer.count(), [1, 0]))  # [[6]]

# Use reduceRegion to apply count().
elev = ee.Image('CGIAR/SRTM90_V4')
roi = ee.Geometry.Point([-119.86, 37.74]).buffer(5000)

# Create a mask where elevation is greater than 2000 meters.
high_elev_mask = elev.gt(2000)

# Update the image with the mask. Pixels = 0 in the mask become null/masked.
masked_elev = elev.updateMask(high_elev_mask)

# Run the count reducer. Masked pixels are ignored.
high_elev_count = masked_elev.reduceRegion(
    reducer=ee.Reducer.count(),
    geometry=roi,
    scale=90,
    maxPixels=int(1e9)
)

display('Count of pixels > 2000m:', high_elev_count.get('elevation'))  # 20
# [END earthengine__apidocs__ee_reducer_count]
