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

# [START earthengine__apidocs__ee_array_atan]
import math
import altair as alt
import pandas as pd

display(ee.Array([-5]).atan())  # [-1.3734]
display(ee.Array([0]).atan())  # [0]
display(ee.Array([5]).atan())  # [1.3734]

start = -5
end = 5
points = ee.Array(ee.List.sequence(start, end, None, 50))
values = points.atan()

df = pd.DataFrame({'x': points.getInfo(), 'atan(x)': values.getInfo()})

# Plot atan() defined above.
alt.Chart(df).mark_line().encode(
    x=alt.X('x', axis=alt.Axis(values=[start, 0, end])),
    y=alt.Y('atan(x)', axis=alt.Axis(values=[-math.pi / 2, 0, math.pi / 2]))
)
# [END earthengine__apidocs__ee_array_atan]
