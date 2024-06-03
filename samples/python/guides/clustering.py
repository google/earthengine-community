# Copyright 2024 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


#  Earth Engine Developer's Guide examples
#   from 'Unsupervised Classification' section.

# [START earthengine__clustering__clustering]
# Load a pre-computed Landsat composite for input.
input = ee.Image('LANDSAT/LE7_TOA_1YEAR/2001')

# Define a region in which to generate a sample of the input.
region = ee.Geometry.Rectangle(29.7, 30, 32.5, 31.7)

# Display the sample region.
m = geemap.Map()
m.set_center(31.5, 31.0, 8)
m.add_layer(ee.Image().paint(region, 0, 2), {}, 'region')

# Make the training dataset.
training = input.sample(region=region, scale=30, numPixels=5000)

# Instantiate the clusterer and train it.
clusterer = ee.Clusterer.wekaKMeans(15).train(training)

# Cluster the input using the trained clusterer.
result = input.cluster(clusterer)

# Display the clusters with random colors.
m.add_layer(result.randomVisualizer(), {}, 'clusters')
m
# [END earthengine__clustering__clustering]
