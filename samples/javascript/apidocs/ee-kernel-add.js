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

// [START earthengine__apidocs__ee_kernel_add]
// Two kernels, they do not need to have the same dimensions.
var kernelA = ee.Kernel.chebyshev({radius: 3});
var kernelB = ee.Kernel.square({radius: 1, normalize: false, magnitude: 100});
print(kernelA, kernelB);

/**
 * Two kernel weights matrices
 *
 *   [3, 3, 3, 3, 3, 3, 3]
 *   [3, 2, 2, 2, 2, 2, 3]
 *   [3, 2, 1, 1, 1, 2, 3]       [100, 100, 100]
 * A [3, 2, 1, 0, 1, 2, 3]     B [100, 100, 100]
 *   [3, 2, 1, 1, 1, 2, 3]       [100, 100, 100]
 *   [3, 2, 2, 2, 2, 2, 3]
 *   [3, 3, 3, 3, 3, 3, 3]
 */

print('Pointwise addition of two kernels', kernelA.add(kernelB));

/**
 * [3, 3,   3,   3,   3, 3, 3]
 * [3, 2,   2,   2,   2, 2, 3]
 * [3, 2, 101, 101, 101, 2, 3]
 * [3, 2, 101, 100, 101, 2, 3]
 * [3, 2, 101, 101, 101, 2, 3]
 * [3, 2,   2,   2,   2, 2, 3]
 * [3, 3,   3,   3,   3, 3, 3]
 */
// [END earthengine__apidocs__ee_kernel_add]
