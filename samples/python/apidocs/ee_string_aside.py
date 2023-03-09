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

# [START earthengine__apidocs__ee_string_aside]
def print_result(val, *params):
  """A print function to invoke with the aside method."""
  print(val.getInfo())
  for param in params:
    print(param)


# aside with no var_args.
# a
ee.String('a').aside(print_result)

# foo
# bar
ee.String('foo').aside(print_result, 'bar')

# foo
# bar
#
# foo
print(ee.String('foo').aside(print_result, 'bar').getInfo())

# aside in the middle of a chain of calls.
# a
# b
#
# ac
print(ee.String('a').aside(print_result, 'b').cat('c').getInfo())

# aside with more than one var_args.
# a
# 1
# 2
ee.String('a').aside(print_result, 1, 2)

# Print a empty JSON string.
# ''
ee.String('').aside(print_result)
# [END earthengine__apidocs__ee_string_aside]
