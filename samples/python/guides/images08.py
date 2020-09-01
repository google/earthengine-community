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

"""Earth Engine Developer's Guide examples from 'Images - Relational, conditional and Boolean operations' page."""

import ee
ee.Initialize()

# [START earthengine__images08__conditional]
# Load a 2012 nightlights image.
nl_2012 = ee.Image('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182012')
lights = nl_2012.select('stable_lights')

# Define arbitrary thresholds on the 6-bit stable lights band.
zones = lights.gt(30).add(lights.gt(55)).add(lights.gt(62))
# [END earthengine__images08__conditional]

# [START earthengine__images08__conditional_exp]
# Create zones using an expression, display.
zones_exp = nl_2012.expression("(b('stable_lights') > 62) ? 3 "
                               ": (b('stable_lights') > 55) ? 2 "
                               ": (b('stable_lights') > 30) ? 1 "
                               ": 0")
# [END earthengine__images08__conditional_exp]
