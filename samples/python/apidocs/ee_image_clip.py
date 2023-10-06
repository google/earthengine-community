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

# [START earthengine__apidocs__ee_image_clip]
# A digital elevation model.
dem = ee.Image('NASA/NASADEM_HGT/001')
dem_vis = {'bands': 'elevation', 'min': 0, 'max': 1500}

# Clip the DEM by a polygon geometry.
geom_poly = ee.Geometry.BBox(-121.55, 39.01, -120.57, 39.38)
dem_clip = dem.clip(geom_poly)
display('Clipped image retains metadata and band names', dem_clip)
m = geemap.Map()
m.set_center(-121.12, 38.13, 8)
m.add_ee_layer(dem_clip, dem_vis, 'Polygon clip')
m.add_ee_layer(geom_poly, {'color': 'green'}, 'Polygon geometry', False)

# Clip the DEM by a line geometry.
geom_line = ee.Geometry.LinearRing(
    [[-121.19, 38.10], [-120.53, 38.54], [-120.22, 37.83], [-121.19, 38.10]]
)
m.add_ee_layer(dem.clip(geom_line), dem_vis, 'Line clip')
m.add_ee_layer(geom_line, {'color': 'orange'}, 'Line geometry', False)

# Images have geometry clip the dem image by the geometry of an S2 image.
s_2_img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG')
geom_s_2_img = s_2_img.geometry()
m.add_ee_layer(dem.clip(geom_s_2_img), dem_vis, 'Image geometry clip')
m.add_ee_layer(geom_s_2_img, {'color': 'blue'}, 'Image geometry', False)

# Don't use ee.Image.clip prior to ee.Image.regionReduction, the "geometry"
# parameter handles it more efficiently.
zonal_max = dem.select('elevation').reduceRegion(
    reducer=ee.Reducer.max(), geometry=geom_poly
)
display('Max elevation (m)', zonal_max.get('elevation'))

# Don't use ee.Image.clip to clip an image by a FeatureCollection, use
# ee.Image.clipToCollection(collection).
watersheds = ee.FeatureCollection('USGS/WBD/2017/HUC10').filterBounds(
    ee.Geometry.Point(-122.754, 38.606).buffer(2e4)
)
m.add_ee_layer(dem.clipToCollection(watersheds), dem_vis, 'Watersheds clip')
m.add_ee_layer(watersheds, {'color': 'red'}, 'Watersheds', False)
m
# [END earthengine__apidocs__ee_image_clip]
