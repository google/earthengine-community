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

# [START earthengine__apidocs__ee_featurecollection_cluster]
# Import a Sentinel-2 surface reflectance image.
image = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG')

# Get the image geometry to define the geographical bounds of a point sample.
image_bounds = image.geometry()

# Sample the image at a set of random points a feature collection is returned.
point_sample_fc = image.sample(
    region=image_bounds, scale=20, numPixels=1000, geometries=True
)

# Instantiate a k-means clusterer and train it.
clusterer = ee.Clusterer.wekaKMeans(5).train(point_sample_fc)

# Cluster the input using the trained clusterer optionally specify the name
# of the output cluster ID property.
clustered_fc = point_sample_fc.cluster(clusterer, 'spectral_cluster')

display(
    'Note added "spectral_cluster" property for an example feature',
    clustered_fc.first().toDictionary(),
)

# Visualize the clusters by applying a unique color to each cluster ID.
palette = ee.List(['8dd3c7', 'ffffb3', 'bebada', 'fb8072', '80b1d3'])
cluster_vis = clustered_fc.map(
    lambda feature: feature.set(
        'style', {'color': palette.get(feature.get('spectral_cluster'))}
    )
).style(styleProperty='style')

# Display the points colored by cluster ID with the S2 image.
m = geemap.Map()
m.set_center(-122.35, 37.47, 9)
m.add_layer(
    image, {'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 1500}, 'S2 image'
)
m.add_layer(cluster_vis, None, 'Clusters')
m
# [END earthengine__apidocs__ee_featurecollection_cluster]
