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

// [START earthengine__apidocs__ee_kernel_euclidean]
print('A Euclidean distance kernel', ee.Kernel.euclidean({radius: 3}));

/**
 * Output weights matrix (up to 1/1000 precision for brevity)
 *
 * [4.242, 3.605, 3.162, 3.000, 3.162, 3.605, 4.242]
 * [3.605, 2.828, 2.236, 2.000, 2.236, 2.828, 3.605]
 * [3.162, 2.236, 1.414, 1.000, 1.414, 2.236, 3.162]
 * [3.000, 2.000, 1.000, 0.000, 1.000, 2.000, 3.000]
 * [3.162, 2.236, 1.414, 1.000, 1.414, 2.236, 3.162]
 * [3.605, 2.828, 2.236, 2.000, 2.236, 2.828, 3.605]
 * [4.242, 3.605, 3.162, 3.000, 3.162, 3.605, 4.242]
 */
// [END earthengine__apidocs__ee_kernel_euclidean]
