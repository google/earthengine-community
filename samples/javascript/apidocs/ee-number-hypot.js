/**
 * Copyright 2021 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START earthengine__apidocs__ee_number_hypot]
// Left input is x and right input is y, representing point (x,y).
print('Length from origin to point (0,0)', ee.Number(0).hypot(0));  // 0
print('Length from origin to point (3,0)', ee.Number(3).hypot(0));  // 3
print('Length from origin to point (3,4)', ee.Number(3).hypot(4));  // 5
print('Length from origin to point (-3,4)', ee.Number(-3).hypot(4));  // 5
print('Length from origin to point (-3,-4)', ee.Number(-3).hypot(-4));  // 5
// [END earthengine__apidocs__ee_number_hypot]
