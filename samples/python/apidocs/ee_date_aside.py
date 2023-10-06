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

# [START earthengine__apidocs__ee_date_aside]
from datetime import datetime

def print_date(ee_date, message):
  """Prints a formatted date, along with a descriptive message."""
  display(message, ee_date.format("YYYY-mm-dd"))

# Print a message when constructing the ee.Date.
ee_date = ee.Date(datetime.now()).aside(print_date, "Today's date (UTC):")
# [END earthengine__apidocs__ee_date_aside]
