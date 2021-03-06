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

// [START earthengine__apidocs__ee_list_add]
print(ee.List([]).add('b'));                // ["b"]
print(ee.List(['a']).add('b'));             // ["a","b"]
print(ee.List(['a']).add(ee.String('b')));  // ["a","b"]

print(ee.List(['a']).add(1));             // ["a",1]
print(ee.List(['a']).add(ee.Number(1)));  // ["a",1]

print(ee.List(['a']).add(true));  // ["a",true]

print(ee.List(['a']).add([]));              // ["a",[]]
print(ee.List(['a']).add(ee.List([])));     // ["a",[]]
print(ee.List(['a']).add(['b']));           // ["a",["b"]]
print(ee.List(['a']).add(ee.List(['b'])));  // ["a",["b"]]

print(ee.List(['a']).add(ee.Dictionary()));          // ["a",{}]
print(ee.List(['a']).add(ee.Dictionary({b: 'c'})));  // ["a",{"b":"c"}]

// 0: a
// 1: Image (1 band)
print(ee.List(['a']).add(ee.Image.constant(1)));

// ["a",{"type":"ImageCollection","bands":[]}]
print(ee.List(['a']).add(ee.ImageCollection([])));
// [END earthengine__apidocs__ee_list_add]
