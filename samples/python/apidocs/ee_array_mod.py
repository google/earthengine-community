# Copyright 2022 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_array_mod]
import altair as alt
import pandas as pd

empty = ee.Array([], ee.PixelType.int8())
display(empty.mod(empty))  # []

display(ee.Array([0, 0]).mod(ee.Array([-1, 2])))  # [0,0]

# [0,0,0,0,0]
display(ee.Array([0, 1, 2, 3, 4]).mod(ee.Array([1, 1, 1, 1, 1])))

# [0,1,0,1,0]
display(ee.Array([0, 1, 2, 3, 4]).mod(ee.Array([2, 2, 2, 2, 2])))

# [0,1,7,0,1]
display(ee.Array([0, 1, 7, 8, 9]).mod(ee.Array([8, 8, 8, 8, 8])))

# [-1,-7,0,-1]
display(ee.Array([-1, -7, -8, -9]).mod(ee.Array([8, 8, 8, 8])))

# [0,1,0,8]
display(ee.Array([8, 8, 8, 8]).mod(ee.Array([-1, -7, -8, -9])))

display(ee.Array([2.5]).mod(ee.Array([1.2])))  # [0.10000000000000009]

# Generate a square wave graph using mod.
start = -10
end = 10
num_elements = 1000
step_size = 2

points = ee.Array(ee.List.sequence(start, end, None, num_elements))
mod_values = ee.Array([step_size]).repeat(0, num_elements)
values = points.mod(mod_values).floor()

df = pd.DataFrame({'x': points.getInfo(), 'mod()': values.getInfo()})

# Plot mod().floor() defined above.
# Generate a square wave that is different for negative and positive values.
alt.Chart(df).mark_line().encode(
    x=alt.X('x'),
    y=alt.Y('mod()', axis=alt.Axis(values=[-3, -2, -1, 0, 1, 2]))
)
# [END earthengine__apidocs__ee_array_mod]
