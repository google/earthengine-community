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

// [START earthengine__apidocs__ee_list_filter]
// An ee.Image list object.
var list = ee.List([1, 2, 3, null, 6, 7]);

// Filter the list by a variety of conditions. Note that the property name
// 'item' is used to refer to list elements in ee.Filter functions.
print('List items equal to 3',
      list.filter(ee.Filter.eq('item', 3)));
print('List items greater than 4',
      list.filter(ee.Filter.gt('item', 4)));
print('List items not null',
      list.filter(ee.Filter.notNull(['item'])));
print('List items in another list',
      list.filter(ee.Filter.inList('item', [1, 98, 99])));
print('List items 3 ≤ 𝑥 ≤ 6',
      list.filter(ee.Filter.and(
        ee.Filter.gte('item', 3),
        ee.Filter.lte('item', 6))));
// [END earthengine__apidocs__ee_list_filter]
