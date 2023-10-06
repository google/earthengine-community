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

# [START earthengine__apidocs__ee_array_log]
import math
import altair as alt
import pandas as pd

display(ee.Array([pow(math.e, -1), 1, math.e]).log())  # [-1,0,1]

start = 0.1
end = 6
points = ee.Array(ee.List.sequence(start, end, None, 50))
values = points.log()

df = pd.DataFrame({'x': points.getInfo(), 'log(x)': values.getInfo()})

# Plot log() defined above.
alt.Chart(df).mark_line().encode(
    x=alt.X('x', axis=alt.Axis(values=[0, 3, end])),
    y=alt.Y('log(x)', axis=alt.Axis(values=[-3, 0, 3]))
)
# [END earthengine__apidocs__ee_array_log]
