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

"""Earth Engine Developer's Guide examples for 'Image information' page."""

import ee
ee.Initialize()

# [START earthengine__images041__sld_stretch]
# Load a Landsat 8 raw image.
image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318')

# Define a RasterSymbolizer element with '_enhance_' for a placeholder.
template_sld = """
<RasterSymbolizer>
  <ContrastEnhancement><_enhance_/></ContrastEnhancement>
  <ChannelSelection>
    <RedChannel>
      <SourceChannelName>B5</SourceChannelName>
    </RedChannel>
    <GreenChannel>
      <SourceChannelName>B4</SourceChannelName>
    </GreenChannel>
    <BlueChannel>
      <SourceChannelName>B3</SourceChannelName>
    </BlueChannel>
  </ChannelSelection>
</RasterSymbolizer>"""

# Get SLDs with different enhancements.
equalize_sld = template_sld.replace('_enhance_', 'Histogram')
normalize_sld = template_sld.replace('_enhance_', 'Normalize')

# Apply the SLD styles to the image.
equalized = image.sldStyle(equalize_sld)
normalized = image.sldStyle(normalize_sld)
# [END earthengine__images041__sld_stretch]
