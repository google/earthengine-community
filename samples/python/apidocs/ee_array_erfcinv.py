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

# [START earthengine__apidocs__ee_array_erfcinv]
import altair as alt
import pandas as pd

display(ee.Array([0.1]).erfcInv())  # [1.163]
display(ee.Array([1]).erfcInv())  # [0]
display(ee.Array([1.9]).erfcInv())  # [-1.163]

start = 0.001
end = 1.999
points = ee.Array(ee.List.sequence(start, end, None, 50))
values = points.erfcInv()

df = pd.DataFrame({'x': points.getInfo(), 'erfcInv(x)': values.getInfo()})

# Plot erfcInv() defined above.
alt.Chart(df).mark_line().encode(
    x=alt.X('x', axis=alt.Axis(values=[0, 1, 2])),
    y=alt.Y('erfcInv(x)', axis=alt.Axis(values=[-3, 0, 3]))
)
# [END earthengine__apidocs__ee_array_erfcinv]
