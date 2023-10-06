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

# [START earthengine__apidocs__ee_array_log10]
import altair as alt
import pandas as pd

display(ee.Array([0.1, 1, 10, 100]).log10())  # [-1,0,1,2]

start = 0.1
end = 100
points = ee.Array(ee.List.sequence(start, end, None, 50))
values = points.log10()

df = pd.DataFrame({'x': points.getInfo(), 'log10(x)': values.getInfo()})

# Plot log10() defined above.
alt.Chart(df).mark_line().encode(
    x=alt.X('x'),
    y=alt.Y('log10(x)')
)
# [END earthengine__apidocs__ee_array_log10]
