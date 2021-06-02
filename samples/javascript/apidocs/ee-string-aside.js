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

// [START earthengine__apidocs__ee_string_aside]
// aside with no var_args.
// a
ee.String('a').aside(print);

// foo
// bar
ee.String('foo').aside(print, 'bar');

// foo
// bar
//
// foo
print(ee.String('foo').aside(print, 'bar'));

// aside in the middle of a chain of calls.
// a
// b
//
// ac
print(ee.String('a').aside(print, 'b').cat('c'));

// aside with more than one var_args.
// a
// 1
// 2
ee.String('a').aside(print, 1, 2);

// Print a empty JSON string.
// ''
ee.String('').aside(print);
// [END earthengine__apidocs__ee_string_aside]
