# Copyright 2020 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License")
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Earth Engine Developer's Guide examples from 'Images - Mathematical operations' page."""

import ee
ee.Initialize()

# [START earthengine__images05__ndvi]
# Load a 5-year Landsat 7 composite 1999-2003.
landsat_1999 = ee.Image('LANDSAT/LE7_TOA_5YEAR/1999_2003')

# Compute NDVI.
ndvi_1999 = (landsat_1999.select('B4').subtract(landsat_1999.select('B3'))
             .divide(landsat_1999.select('B4').add(landsat_1999.select('B3'))))
# [END earthengine__images05__ndvi]

# [START earthengine__images05__per_band]
# Load a 5-year Landsat 7 composite 2008-2012.
landsat_2008 = ee.Image('LANDSAT/LE7_TOA_5YEAR/2008_2012')

# Compute multi-band difference between the 2008-2012 composite and the
# previously loaded 1999-2003 composite.
diff = landsat_2008.subtract(landsat_1999)

# Compute the squared difference in each band.
squared_difference = diff.pow(2)
# [END earthengine__images05__per_band]
