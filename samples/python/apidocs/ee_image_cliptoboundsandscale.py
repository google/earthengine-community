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

# [START earthengine__apidocs__ee_image_cliptoboundsandscale]
# A digital elevation model.
dem = ee.Image('NASA/NASADEM_HGT/001')
dem_vis = {'bands': 'elevation', 'min': 0, 'max': 2000}
display('DEM', dem)
m = geemap.Map()
m.set_center(-121.38, 46.51, 8)
m.add_layer(dem, dem_vis, 'DEM')

# Clip DEM by a single polygon geometry, specify width and height parameters.
geom_1 = ee.Geometry.BBox(-123.55, 46.61, -122.57, 46.98)
dem_clip_1 = dem.clipToBoundsAndScale(geometry=geom_1, width=20, height=10)
display('Clipped image retains metadata and band names', dem_clip_1)
m.add_layer(dem_clip_1, dem_vis, 'Single geometry clip (width, height)')
m.add_layer(geom_1, {'color': 'red'}, 'Single geometry (width, height)')

# Clip DEM by a single polygon geometry, specify maxDimension parameter.
geom_2 = ee.Geometry.BBox(-120.79, 46.58, -120.16, 46.81)
dem_clip_2 = dem.clipToBoundsAndScale(geometry=geom_2, maxDimension=5)
m.add_layer(dem_clip_2, dem_vis, 'Single polygon clip (maxDimension)')
m.add_layer(geom_2, {'color': 'yellow'}, 'Single polygon (maxDimension)')

# Clip DEM by a single polygon geometry, specify scale parameter.
geom_3 = ee.Geometry.BBox(-120.79, 46.18, -120.16, 46.41)
dem_clip_3 = dem.clipToBoundsAndScale(geometry=geom_3, scale=1e4)
m.add_layer(dem_clip_3, dem_vis, 'Single polygon clip (scale)')
m.add_layer(geom_3, {'color': 'blue'}, 'Single polygon (scale)')
m
# [END earthengine__apidocs__ee_image_cliptoboundsandscale]
