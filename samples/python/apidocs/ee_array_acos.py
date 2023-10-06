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

# [START earthengine__apidocs__ee_array_acos]
import math
import altair as alt
import pandas as pd

display(ee.Array([-1]).acos())  # [π]
display(ee.Array([0]).acos())  # [π/2]
display(ee.Array([1]).acos())  # [0]

start = -1
end = 1
points = ee.Array(ee.List.sequence(start, end, None, 50))
values = points.acos()

df = pd.DataFrame({'x': points.getInfo(), 'acos(x)': values.getInfo()})

# Plot acos() defined above.
alt.Chart(df).mark_line().encode(
    x=alt.X('x', axis=alt.Axis(values=[start, 0, end])),
    y=alt.Y('acos(x)', axis=alt.Axis(values=[0, math.pi / 2, math.pi]))
)
# [END earthengine__apidocs__ee_array_acos]
