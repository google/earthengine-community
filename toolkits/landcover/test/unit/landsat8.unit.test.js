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

var lct = require('../../api');

withEarthEngineStub('Landsat8', function() {
  it('Constructor uses default collection', function() {
    var dataset = lct.Landsat8();

    expect(dataset.getImageCollection())
        .toEqual(ee.ImageCollection(lct.Landsat8.DEFAULT_COLLECTION_ID));
  });

  it('Constructor uses specified collection', function() {
    var mockCollection = ee.ImageCollection('TEST');
    var dataset = lct.Landsat8(mockCollection);

    expect(dataset.getImageCollection()).toEqual(mockCollection);
  });

  it('fmaskCloudsAndShadows() calls map', function() {
    var mockCollection = ee.ImageCollection('TEST');
    spyOn(mockCollection, 'map');
    var dataset = lct.Landsat8(mockCollection);

    dataset.fmaskCloudsAndShadows();

    expect(mockCollection.map).toHaveBeenCalled();
  });

  it('fmaskCloudsAndShadows() returns self', function() {
    var dataset = lct.Landsat8();

    expect(dataset.fmaskCloudsAndShadows()).toEqual(dataset);
  });

  it('applyCloudAndShadowBitMasks() updates mask', function() {
    var mockImage = ee.Image(0);
    spyOn(mockImage, 'updateMask');

    lct.Landsat8.applyCloudAndShadowBitMasks(mockImage);

    expect(mockImage.updateMask).toHaveBeenCalled();
  });

  it('applyCloudAndShadowBitMasks() returns new image', function() {
    var mockImage = ee.Image(0);

    var newImage = lct.Landsat8.applyCloudAndShadowBitMasks(mockImage);

    expect(newImage).toBeTruthy();
    expect(newImage).not.toEqual(mockImage);
  });
});
