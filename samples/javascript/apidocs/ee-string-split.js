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

// [START earthengine__apidocs__ee_string_split]
var s = ee.String('aBAbcD');
print(s.split('Ab')); // ["aB","cD"]
// 'i' tells split to ignore case.
print(s.split('ab', 'i')); // ["","","cD"]
// Split on 'b' or 'c'
print(s.split('[bc]', 'i')); // ["a","A","","D"]
// Split on 'BA' or 'c'
print(s.split('(BA|c)')); // ["a","b","D"]

var s = ee.String('a,b,cdee f,g');
// ["a",",","b",",","c","d","e","e"," ","f",",","g"]
print(s.split(''));

print(s.split(' ')); // ["a,b,cdee","f,g"]
print(s.split('[[:space:]]')); // ["a,b,cdee","f,g"]

print(s.split(',')); // ["a","b","cdee f","g"]

print(s.split('ee')); // ["a,b,cd"," f,g"]

// Split on any lower case letter.
print(s.split('[a-z]')); // ["",",",",","","",""," ",","]

// ^ as the first character in [] excludes.
print(s.split('[^a-z]')); // ["a","b","cdee","f","g"]

// Splitting on characters that are special to split.
var s = ee.String('a.b*c?d');
print(s.split('\\.')); // ["a","b*c?d"]
print(s.split('[*]')); // ["a.b","c?d"]
print(s.split('[?]')); // ["a.b*c","d"]
// [END earthengine__apidocs__ee_string_split]
