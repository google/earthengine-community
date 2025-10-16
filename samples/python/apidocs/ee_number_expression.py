# Copyright 2022 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_number_expression]
# A dictionary of variables to use in expression.
variables = {'x': 5, 'y': 10}

# Arithmetic operators.
display('x + y:',
        ee.Number.expression('x + y', variables).getInfo())
display('x - y:',
        ee.Number.expression('x - y', variables).getInfo())
display('x * y:',
        ee.Number.expression('x * y', variables).getInfo())
display('x / y:',
        ee.Number.expression('x / y', variables).getInfo())
display('x ** y:',
        ee.Number.expression('x ** y', variables).getInfo())
display('x % y:',
        ee.Number.expression('x % y', variables).getInfo())

# Logical operators.
display('x || y:',
        ee.Number.expression('x || y', variables).getInfo())
display('x && y:',
        ee.Number.expression('x && y', variables).getInfo())
display('!(x):',
        ee.Number.expression('!(x)', variables).getInfo())

# Relational operators.
display('x > y:',
        ee.Number.expression('x > y', variables).getInfo())
display('x >= y:',
        ee.Number.expression('x >= y', variables).getInfo())
display('x < y:',
        ee.Number.expression('x < y', variables).getInfo())
display('x <= y:',
        ee.Number.expression('x <= y', variables).getInfo())
display('x == y:',
        ee.Number.expression('x == y', variables).getInfo())
display('x != y:',
        ee.Number.expression('x != y', variables).getInfo())

# Conditional JavaScript (ternary) operator.
display('(x < y) ? 100 : 1000):',
        ee.Number.expression('(x < y) ? 100 : 1000', variables).getInfo())

# Constants in the expression.
display('100 * (x + y):',
        ee.Number.expression('100 * (x + y)', variables).getInfo())

# JavaScript Math constants.
display('Math.PI:',
        ee.Number.expression('Math.PI', None).getInfo())
display('Math.E:',
        ee.Number.expression('Math.E', None).getInfo())

# Dot notation to call on child elements.
display('Use dot notation to call on child elements:',
        ee.Number.expression('vals.x * vals.y', {'vals': variables}).getInfo())

# ee.Number functions.
display('Use ee.Number add. add(x, y):',
        ee.Number.expression('add(x, y)', variables).getInfo())
display('Use ee.Number add and subtract. subtract(add(x, y), 5):',
        ee.Number.expression('subtract(add(x, y), 5)', variables).getInfo())
# [END earthengine__apidocs__ee_number_expression]
