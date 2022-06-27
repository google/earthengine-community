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

// [START earthengine__apidocs__ee_kernel_diamond]
print('A diamond kernel', ee.Kernel.diamond({radius: 3}));

/**
 * Output weights matrix (up to 1/100 precision for brevity)
 *
 * [0.00, 0.00, 0.00, 0.04, 0.00, 0.00, 0.00]
 * [0.00, 0.00, 0.04, 0.04, 0.04, 0.00, 0.00]
 * [0.00, 0.04, 0.04, 0.04, 0.04, 0.04, 0.00]
 * [0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04]
 * [0.00, 0.04, 0.04, 0.04, 0.04, 0.04, 0.00]
 * [0.00, 0.00, 0.04, 0.04, 0.04, 0.00, 0.00]
 * [0.00, 0.00, 0.00, 0.04, 0.00, 0.00, 0.00]
 */
// [END earthengine__apidocs__ee_kernel_diamond]
