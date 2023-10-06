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

# [START earthengine__apidocs__ee_array_tan]
import math
import altair as alt
import pandas as pd

π = math.pi
display(ee.Array([-π / 4]).tan())  # [Almost -1]
display(ee.Array([0]).tan())  # [0]
display(ee.Array([π / 4]).tan())  # [Almost 1]

start = -π / 3
end = π / 3
points = ee.Array(ee.List.sequence(start, end, None, 50))
values = points.tan()

df = pd.DataFrame({'x': points.getInfo(), 'tan(x)': values.getInfo()})

# Plot tan() defined above.
alt.Chart(df).mark_line().encode(
    x=alt.X('x', axis=alt.Axis(values=[start, 0, end])),
    y=alt.Y('tan(x)', axis=alt.Axis(values=[-math.sqrt(3), 0, math.sqrt(3)]))
)
# [END earthengine__apidocs__ee_array_tan]
