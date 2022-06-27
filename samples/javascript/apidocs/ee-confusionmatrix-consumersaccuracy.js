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

// [START earthengine__apidocs__ee_confusionmatrix_consumersaccuracy]
// Construct a confusion matrix from an array (rows are actual values,
// columns are predicted values). We construct a confusion matrix here for
// brevity and clear visualization, in most applications the confusion matrix
// will be generated from ee.Classifier.confusionMatrix.
var array = ee.Array([[32, 0, 0,  0,  1, 0],
                      [ 0, 5, 0,  0,  1, 0],
                      [ 0, 0, 1,  3,  0, 0],
                      [ 0, 1, 4, 26,  8, 0],
                      [ 0, 0, 0,  7, 15, 0],
                      [ 0, 0, 0,  1,  0, 5]]);
var confusionMatrix = ee.ConfusionMatrix(array);
print("Constructed confusion matrix", confusionMatrix);

// Calculate overall accuracy.
print("Overall accuracy", confusionMatrix.accuracy());

// Calculate consumer's accuracy, also known as user's accuracy or
// specificity and the complement of commission error (1 − commission error).
print("Consumer's accuracy", confusionMatrix.consumersAccuracy());

// Calculate producer's accuracy, also known as sensitivity and the
// compliment of omission error (1 − omission error).
print("Producer's accuracy", confusionMatrix.producersAccuracy());

// Calculate kappa statistic.
print('Kappa statistic', confusionMatrix.kappa());
// [END earthengine__apidocs__ee_confusionmatrix_consumersaccuracy]
