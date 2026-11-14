# Copyright 2025 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_featurecollection_runbigquery]

import json
import pandas as pd

# Get places from Overture Maps Dataset in BigQuery public data.
location = ee.Geometry.Point(-3.69, 40.41)
map_geometry = json.dumps(location.buffer(5e3).getInfo())

sql = f"""SELECT geometry, names.primary as name, categories.primary as category
FROM bigquery-public-data.overture_maps.place
WHERE ST_INTERSECTS(geometry, ST_GEOGFROMGEOJSON('{map_geometry}'))"""

features = ee.FeatureCollection.runBigQuery(
    query=sql, geometryColumn="geometry"
)

# Display all relevant features on the map.
m = geemap.Map()
m.center_object(location, 13)
m.add_layer(features, {'color': 'black'}, 'Places from Overture Maps Dataset')
display(m)

# Create a histogram of the place categories.
property_of_interest = 'category'
histogram = (
    features.filter(
        ee.Filter.notNull([property_of_interest])
    ).aggregate_histogram(property_of_interest)
).getInfo()

# Display the histogram as a pandas DataFrame.
df = pd.DataFrame(list(histogram.items()), columns=['category', 'frequency'])
df = df.sort_values(by=['frequency'], ascending=False, ignore_index=True)
display(df)
# [END earthengine__apidocs__ee_featurecollection_runbigquery]