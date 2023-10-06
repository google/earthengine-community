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

# [START earthengine__apidocs__ee_array_sin]
import math
import altair as alt
import pandas as pd

π = math.pi

display(ee.Array([-π]).sin())  # [Almost zero]
display(ee.Array([-π / 2.0]).sin())  # [-1]
display(ee.Array([0]).sin())  # [0]
display(ee.Array([π / 2.0]).sin())  # [1]
display(ee.Array([π]).sin())  # [Almost zero]

start = -π
end = π
points = ee.Array(ee.List.sequence(start, end, None, 50))
values = points.sin()

df = pd.DataFrame({'x': points.getInfo(), 'sin(x)': values.getInfo()})

# Plot sin() defined above.
alt.Chart(df).mark_line().encode(
    x=alt.X('x', axis=alt.Axis(values=[start, 0, end])),
    y=alt.Y('sin(x)', axis=alt.Axis(values=[-1, 0, 1]))
)
# [END earthengine__apidocs__ee_array_sin]
