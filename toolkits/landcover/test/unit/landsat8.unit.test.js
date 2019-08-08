/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var assert = require('assert');
var lct = require('../../api');

withEarthEngineStub('Landsat8', function() {
  it('fmaskCloudsAndShadows()', function() {
    var dataset = lct.Landsat8();

    // Create spy to capture to invocation of updateMask().
    spyOn(ee.Image.prototype, 'updateMask').and.callThrough();

    dataset = dataset.fmaskCloudsAndShadows();

    // Verify updateMask() was called with the appropriate mask.
    expect(ee.Image.prototype.updateMask)
        .toHaveBeenCalledWith(eeObjectMatching({
          'Image.and': {
            image1: {
              'Image.eq': {
                image1: {
                  'Image.bitwiseAnd': {
                    image1: {
                      'Image.select': {
                        input: '$uninitializedVar',
                        bandSelectors: ['pixel_qa']
                      }
                    },
                    image2: {'Image.constant': {value: 8}}
                  }
                },
                image2: {'Image.constant': {value: 0}}
              }
            },
            image2: {
              'Image.eq': {
                image1: {
                  'Image.bitwiseAnd': {
                    image1: {
                      'Image.select': {
                        input: '$uninitializedVar',
                        bandSelectors: ['pixel_qa']
                      }
                    },
                    image2: {'Image.constant': {value: 32}}
                  }
                },
                image2: {'Image.constant': {value: 0}}
              }
            }
          }
        }));
  });
});