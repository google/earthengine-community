# Copyright 2021 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_date_advance]
"""Demonstrates the ee.Date.advance method."""

import ee


# Authenticates to the Earth Engine servers.
ee.Authenticate()
# Initializes the client library.
ee.Initialize()


def print_date(ee_date, message):
  """Prints a formatted date, along with a descriptive message."""
  print(ee_date.format().getInfo(), message)

# Defines a base date/time for the following examples.
BASE_DATE = ee.Date('2020-01-01T00:00', 'UTC')
print_date(BASE_DATE, 'The base date/time')

# Demonstrates basic usage.
print_date(BASE_DATE.advance(1, 'week'), '+1 week')
print_date(BASE_DATE.advance(2, 'years'), '+2 years')

# Demonstrates that negative delta moves back in time.
print_date(BASE_DATE.advance(-1, 'second'), '-1 second')
# [END earthengine__apidocs__ee_date_advance]
