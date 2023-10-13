# Copyright 2023 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_featurecollection_iterate]
import altair as alt

# CAUTION: ee.FeatureCollection.iterate can be less efficient than alternative
# solutions implemented using ee.FeatureCollection.map or by converting feature
# properties to an ee.Array object and using ee.Array.slice and
# ee.Array.arrayAccum methods. Avoid ee.FeatureCollection.iterate if possible.

# Monthly precipitation accumulation for 2020.
climate = (
    ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE')
    .filterDate('2020-01-01', '2021-01-01')
    .select('pr')
)

# Region of interest: north central New Mexico, USA.
roi = ee.Geometry.BBox(-107.19, 35.27, -104.56, 36.83)


# A FeatureCollection of mean monthly precipitation accumulation for the
# region of interest.
def mean_precip_ts_fun(image):
  mean_precip = image.reduceRegion(
      reducer=ee.Reducer.mean(), geometry=roi, scale=5000
  )
  return ee.Feature(roi, mean_precip).set(
      'system:time_start', image.get('system:time_start')
  )


mean_precip_ts = climate.map(mean_precip_ts_fun)


# A cumulative sum function to apply to each feature in the
# precipitation FeatureCollection. The first input is the current feature and
# the second is a list of features that accumulates at each step of the
# iteration. The function fetches the last feature in the feature list, gets
# the cumulative precipitation sum value from it, and adds it to the current
# feature's precipitation value. The new cumulative precipitation sum is set
# as a property of the current feature, which is appended to the feature list
# that is passed onto the next step of the iteration.
def cumsum(current_feature, feature_list):
  feature_list = ee.List(feature_list)
  previous_sum = ee.Feature(feature_list.get(-1)).getNumber('pr_cumsum')
  current_val = ee.Feature(current_feature).getNumber('pr')
  current_sum = previous_sum.add(current_val)
  return feature_list.add(current_feature.set('pr_cumsum', current_sum))


# Use "iterate" to cumulatively sum monthly precipitation over the year with
# the above defined "cumsum" function. Note that the feature list used in the
# "cumsum" function is initialized as the "first" variable. It includes a
# temporary feature with the "pr_cumsum" property set to 0 this feature is
# filtered out of the final FeatureCollection.
first = ee.List([ee.Feature(None, {'pr_cumsum': 0, 'first': True})])
precip_cum_sum = ee.FeatureCollection(
    ee.List(mean_precip_ts.iterate(cumsum, first))
).filter(ee.Filter.notNull(['pr']))

precip_cum_sum = precip_cum_sum.map(
    lambda feature: feature.set(
        'date',
        ee.Date(feature.getNumber('system:time_start')).format('YYYY-MM-dd'),
    )
)

# Inspect the outputs.
display('Note cumulative precipitation ("pr_cumsum") property', precip_cum_sum)

df = geemap.ee_to_df(precip_cum_sum, ['date', 'pr', 'pr_cumsum'])
display(df)

chart = (
    alt.Chart(df)
    .mark_line()
    .encode(x='date:T', y='pr:Q', color=alt.value('blue'))
)
chart += (
    alt.Chart(df)
    .mark_line()
    .encode(x='date:T', y='pr_cumsum:Q', color=alt.value('red'))
)
chart
# [END earthengine__apidocs__ee_featurecollection_iterate]
