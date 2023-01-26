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

# [START earthengine__apidocs__ee_number_lanczos]
print('Lanczos approx. of -1:', ee.Number(-1).lanczos().getInfo())  # Infinity
print('Lanczos approx. of -0.9:',
      ee.Number(-0.9).lanczos().getInfo())  # 524.955196990
print('Lanczos approx. of 0:', ee.Number(0).lanczos().getInfo())  # 32.946318679
print('Lanczos approx. of 10:',
      ee.Number(10).lanczos().getInfo())  # 2.281783181
print('Lanczos approx. of 1e10:',
      ee.Number(1e10).lanczos().getInfo())  # 1.000000001
# [END earthengine__apidocs__ee_number_lanczos]
