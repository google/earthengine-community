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

// [START earthengine__apidocs__ee_confusionmatrix]
// A confusion matrix. Rows correspond to actual values, columns to
// predicted values.
var array = ee.Array([[32, 0, 0,  0,  1, 0],
                      [ 0, 5, 0,  0,  1, 0],
                      [ 0, 0, 1,  3,  0, 0],
                      [ 0, 1, 4, 26,  8, 0],
                      [ 0, 0, 0,  7, 15, 0],
                      [ 0, 0, 0,  1,  0, 5]]);
print('Constructed confusion matrix',
      ee.ConfusionMatrix(array));

// The "order" parameter refers to row and column class labels. When
// unspecified, the class labels are assumed to be a 0-based sequence
// incrementing by 1 with a length equal to row/column size.
print('Default row/column labels (unspecified "order" parameter)',
      ee.ConfusionMatrix({array: array, order: null}).order());

// Set the "order" parameter when custom class label integers are required. The
// list of integer value labels should correspond to the matrix axes left to
// right / top to bottom.
var order = [11, 22, 42, 52, 71, 81];
print('Specified row/column labels (specified "order" parameter)',
      ee.ConfusionMatrix({array: array, order: order}).order());
// [END earthengine__apidocs__ee_confusionmatrix]
