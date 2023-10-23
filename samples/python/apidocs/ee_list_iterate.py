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

# [START earthengine__apidocs__ee_list_iterate]
import matplotlib.pyplot as plt

# This example uses the ee.List.iterate function to generate a series of
# sequentially halved values.

# Declare a list that will hold the series of sequentially halved values,
# initialize it with the starting quantity.
quantity_list = [1000]

# Define the number of iterations as a list sequence.
n_steps = ee.List.sequence(1, 10)


# Declare a function that takes the current element of the iteration list and
# the returned result of the previous iteration as inputs. In this case, the
# the function is returning an accumulating list of quantities that are reduced
# by half at each iteration.
def half_of_previous(current_element, previous_result):
  previous_quantity = ee.Number(ee.List(previous_result).get(-1))
  current_quantity = previous_quantity.divide(2)
  return ee.List(previous_result).add(current_quantity)


# Apply the function to the n_steps list, each element is an iteration.
quantity_list = ee.List(n_steps.iterate(half_of_previous, quantity_list))

# Display the results.
display('Steps in the iteration of halved quantities', n_steps)
display('Series of sequentially halved quantities', quantity_list)
quantity_list_client = quantity_list.getInfo()
plt.scatter(range(len(quantity_list_client)), quantity_list_client)
plt.show()
# [END earthengine__apidocs__ee_list_iterate]
