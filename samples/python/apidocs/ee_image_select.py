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

# [START earthengine__apidocs__ee_image_select]
# A Sentinel-2 surface reflectance image.
img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG')
display('All band names:', img.bandNames())

display('Select a band by name:', img.select('B11').bandNames())

display('Select a band by index:', img.select(10).bandNames())

display('Select bands using a list:',
      img.select(['B11', 'B8', 'B3']).bandNames())

display('Select bands by an argument series:',
      img.select('B11', 'B8', 'B3').bandNames())

display('Mixing string and integer selectors is valid:',
      img.select(10, 'B8', 2).bandNames())

display('Rename selected bands using two corresponding lists:',
      img.select(['B11', 'B8', 'B3'], ['SWIR1', 'NIR', 'Green'])
      .bandNames())

# Use regular expressions to select bands.
display('Match "QA" followed by any two characters:',
      img.select('QA..').bandNames())

display('Match "B" followed by any character, any number of times:',
      img.select('B.*').bandNames())

display('Match "B" followed by any character, and any optional third character',
      img.select('B..?').bandNames())

display('Match "B" followed by a character in the range 6-8',
      img.select('B[6-8]').bandNames())

display('Match "B" followed by a character in the range 1-9 and then 1-2',
      img.select('B[1-9][1-2]').bandNames())

display('Match "B" or "QA" each followed by any character, any number of times.',
      img.select('B.*|QA.*').bandNames())
# [END earthengine__apidocs__ee_image_select]
