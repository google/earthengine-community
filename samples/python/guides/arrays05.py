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
#   from 'Arrays - Eigen analysis' section

# Use these bands.
band_names = ee.List(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'B11'])

# Load a landsat 8 image and select the bands of interest.
image = ee.Image('LANDSAT/LC08/C02/T1/LC08_044034_20140318').select(band_names)

# Display the input imagery and the region in which to do the PCA.
region = image.geometry()
m = geemap.Map()
m.center_object(region, 10)
m.add_layer(ee.Image().paint(region, 0, 2), {}, 'Region')
m.add_layer(
    image,
    {'bands': ['B5', 'B4', 'B2'], 'min': 0, 'max': 20000},
    'Original Image',
)
display(m)

# Set an appropriate scale for Landsat data.
scale = 30

# Mean center the data to enable a faster covariance reducer
# and an SD stretch of the principal components.
mean_dict = image.reduceRegion(
    reducer=ee.Reducer.mean(), geometry=region, scale=scale, maxPixels=1e9
)
means = mean_dict.toImage(band_names)
centered = image.subtract(means)


# This helper function returns a list of new band names.
def get_new_band_names(prefix):
  seq = ee.List.sequence(1, band_names.length())

  def add_prefix_and_number(b):
    return ee.String(prefix).cat(ee.Number(b).int())

  return seq.map(add_prefix_and_number)


# This function accepts mean centered imagery, a scale and
# a region in which to perform the analysis.  It returns the
# Principal Components (PC) in the region as a new image.
# [START earthengine__arrays05__principal_components]
def get_principal_components(centered, scale, region):
  # Collapse bands into 1D array
  arrays = centered.toArray()

  # Compute the covariance of the bands within the region.
  covar = arrays.reduceRegion(
      reducer=ee.Reducer.centeredCovariance(),
      geometry=region,
      scale=scale,
      maxPixels=1e9,
  )

  # Get the 'array' covariance result and cast to an array.
  # This represents the band-to-band covariance within the region.
  covar_array = ee.Array(covar.get('array'))

  # Perform an eigen analysis and slice apart the values and vectors.
  eigens = covar_array.eigen()

  # This is a P-length vector of Eigenvalues.
  eigen_values = eigens.slice(1, 0, 1)
  # This is a PxP matrix with eigenvectors in rows.
  eigen_vectors = eigens.slice(1, 1)

  # Convert the array image to 2D arrays for matrix computations.
  array_image = arrays.toArray(1)

  # Left multiply the image array by the matrix of eigenvectors.
  principal_components = ee.Image(eigen_vectors).matrixMultiply(array_image)

  # Turn the square roots of the Eigenvalues into a P-band image.
  sd_image = (
      ee.Image(eigen_values.sqrt())
      .arrayProject([0])
      .arrayFlatten([get_new_band_names('sd')])
  )

  # Turn the PCs into a P-band image, normalized by SD.
  return (
      # Throw out an an unneeded dimension, [[]] -> [].
      principal_components.arrayProject([0])
      # Make the one band array image a multi-band image, [] -> image.
      .arrayFlatten([get_new_band_names('pc')])
      # Normalize the PCs by their SDs.
      .divide(sd_image)
  )


# [END earthengine__arrays05__principal_components]

# Get the PCs at the specified scale and in the specified region
pc_image = get_principal_components(centered, scale, region)

# Plot each PC as a new layer
for band in pc_image.bandNames().getInfo():
  m.add_layer(pc_image.select([band]), {'min': -2, 'max': 2}, band)
