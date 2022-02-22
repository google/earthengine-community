/**
 * Copyright 2022 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_list_splice]
// An ee.List object.
var list = ee.List([0, 1, 2, 3, 4]);
print('Original list', list);

// If "other" argument is null, elements at positions specified by "start" and
// "count" are deleted. Here, the 3rd element is removed.
print('Remove 1 element', list.splice({start: 2, count: 1, other: null}));

// If "start" is negative, the position is from the end of the list.
print('Remove 2nd from last element', list.splice(-2, 1));

// Deletes 3 elements starting at position 1.
print('Remove multiple sequential elements', list.splice(1, 3));

// Insert elements from the "other" list without deleting existing elements
// by specifying the insert "start" position and setting "count" to 0.
print('Insert new elements', list.splice(2, 0, ['X', 'Y', 'Z']));

// Replace existing elements with those from the "other" list by specifying the
// "start" position to replace and the "count" of proceeding elements. If
// length of "other" list is greater than "count", the remaining "other"
// elements are inserted, they do not replace existing elements.
print('Replace elements', list.splice(2, 3, ['X', 'Y', 'Z']));
// [END earthengine__apidocs__ee_list_splice]
