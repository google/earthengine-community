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

# [START earthengine__apidocs__ee_array_asin]
import math
import altair as alt
import pandas as pd

display(ee.Array([-1]).asin())  # [-π/2]
display(ee.Array([0]).asin())  # [0]
display(ee.Array([1]).asin())  # [π/2]

start = -1
end = 1
points = ee.Array(ee.List.sequence(start, end, None, 50))
values = points.asin()

df = pd.DataFrame({'x': points.getInfo(), 'asin(x)': values.getInfo()})

# Plot asin() defined above.
alt.Chart(df).mark_line().encode(
    x=alt.X('x', axis=alt.Axis(values=[start, 0, end])),
    y=alt.Y('asin(x)', axis=alt.Axis(values=[-math.pi / 2, 0, math.pi / 2]))
)
# [END earthengine__apidocs__ee_array_asin]
