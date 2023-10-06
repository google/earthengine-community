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

# [START earthengine__apidocs__ee_array_erfinv]
import altair as alt
import pandas as pd

display(ee.Array([-0.99]).erfInv())  # [-1.82]
display(ee.Array([0]).erfInv())  # [0]
display(ee.Array([0.99]).erfInv())  # [1.82]

start = -0.99
end = 0.99
points = ee.Array(ee.List.sequence(start, end, None, 50))
values = points.erfInv()

df = pd.DataFrame({'x': points.getInfo(), 'erfInv(x)': values.getInfo()})

# Plot erfInv() defined above.
alt.Chart(df).mark_line().encode(
    x=alt.X('x', axis=alt.Axis(values=[-1, 0, 1])),
    y=alt.Y('erfInv(x)', axis=alt.Axis(values=[-2, 0, 2]))
)
# [END earthengine__apidocs__ee_array_erfinv]
