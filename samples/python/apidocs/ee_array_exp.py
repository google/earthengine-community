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

# [START earthengine__apidocs__ee_array_exp]
import altair as alt
import pandas as pd

empty = ee.Array([], ee.PixelType.int8())
display(empty.exp())  # []

# [pow(math.e, -1), 1, math.e, 7.389]
display(ee.Array([-1, 0, 1, 2]).exp())

start = -5
end = 2
points = ee.Array(ee.List.sequence(start, end, None, 50))
values = points.exp()

df = pd.DataFrame({'x': points.getInfo(), 'exp(x)': values.getInfo()})

# Plot exp() defined above.
alt.Chart(df).mark_line().encode(
    x=alt.X('x'),
    y=alt.Y('exp(x)')
)
# [END earthengine__apidocs__ee_array_exp]
