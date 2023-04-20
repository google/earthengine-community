# Copyright 2023 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_confusionmatrix_order]
# Construct an error/confusion matrix from an array (rows are actual values,
# columns are predicted values). We construct an error matrix here for brevity
# and matrix visualization, in most applications the confusion matrix will be
# generated from ee.Classifier.confusionMatrix.
array = ee.Array([[32, 0, 0,  0,  1, 0],
                  [ 0, 5, 0,  0,  1, 0],
                  [ 0, 0, 1,  3,  0, 0],
                  [ 0, 1, 4, 26,  8, 0],
                  [ 0, 0, 0,  7, 15, 0],
                  [ 0, 0, 0,  1,  0, 5]])

cm_default_order = ee.ConfusionMatrix(array)
print('Default name and order of the rows and columns:',
      cm_default_order.order().getInfo())

order = [11, 22, 42, 52, 71, 81]
cm_specified_order = ee.ConfusionMatrix(array, order)
print('Specified name and order of the rows and columns:',
      cm_specified_order.order().getInfo())
# [END earthengine__apidocs__ee_confusionmatrix_order]
