"""Copyright 2020 The Google Earth Engine Community Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

import datetime
import os
import time

from absl import app
from absl import flags
from dateutil import relativedelta
import pytz

import ee

flags.DEFINE_integer('num_utm_grid_cells', 389, 'UTM grid cell count')

FLAGS = flags.FLAGS


def timestamp_ms_for_datetime(dt):
  return time.mktime(dt.timetuple()) * 1000


def parse_date_from_gedi_filename(vector_asset_id):
  return pytz.utc.localize(
      datetime.datetime.strptime(
          os.path.basename(vector_asset_id).split('_')[2], '%Y%j%H%M%S'))


def rasterize_gedi_by_utm_zone(
    vector_asset_ids, grid_cell_id, grid_cell_feature, raster_collection):
  """Starts an Earth Engine task generating a raster asset covering a month."""
  datetimes = [parse_date_from_gedi_filename(x) for x in vector_asset_ids]
  if len(set(x.month for x in datetimes)) > 1:
    raise ValueError('Found more than one month in filenames')
  month = datetimes[0].month
  year = datetimes[0].year

  props = [
      'beam', 'degrade_flag', 'delta_time',
      'digital_elevation_model', 'digital_elevation_model_srtm',
      'elev_highestreturn', 'elev_lowestmode', 'elevation_bias_flag',
      'energy_total', 'landsat_treecover', 'landsat_water_persistence',
      'lat_highestreturn', 'leaf_off_doy', 'leaf_off_flag', 'leaf_on_cycle',
      'leaf_on_doy', 'lon_highestreturn', 'modis_nonvegetated',
      'modis_nonvegetated_sd', 'modis_treecover', 'modis_treecover_sd',
      'num_detectedmodes', 'pft_class', 'quality_flag', 'region_class',
      'selected_algorithm', 'selected_mode', 'selected_mode_flag',
      'sensitivity', 'shot_number', 'solar_azimuth', 'solar_elevation',
      'surface_flag', 'urban_focal_window_size', 'urban_proportion',
      'rh0', 'rh1', 'rh2', 'rh3', 'rh4', 'rh5', 'rh6', 'rh7', 'rh8', 'rh9',
      # pylint:disable=line-too-long
      'rh10', 'rh11', 'rh12', 'rh13', 'rh14', 'rh15', 'rh16', 'rh17', 'rh18', 'rh19',
      'rh20', 'rh21', 'rh22', 'rh23', 'rh24', 'rh25', 'rh26', 'rh27', 'rh28', 'rh29',
      'rh30', 'rh31', 'rh32', 'rh33', 'rh34', 'rh35', 'rh36', 'rh37', 'rh38', 'rh39',
      'rh40', 'rh41', 'rh42', 'rh43', 'rh44', 'rh45', 'rh46', 'rh47', 'rh48', 'rh49',
      'rh50', 'rh51', 'rh52', 'rh53', 'rh54', 'rh55', 'rh56', 'rh57', 'rh58', 'rh59',
      'rh60', 'rh61', 'rh62', 'rh63', 'rh64', 'rh65', 'rh66', 'rh67', 'rh68', 'rh69',
      'rh70', 'rh71', 'rh72', 'rh73', 'rh74', 'rh75', 'rh76', 'rh77', 'rh78', 'rh79',
      'rh80', 'rh81', 'rh82', 'rh83', 'rh84', 'rh85', 'rh86', 'rh87', 'rh88', 'rh89',
      'rh90', 'rh91', 'rh92', 'rh93', 'rh94', 'rh95', 'rh96', 'rh97', 'rh98', 'rh99',
      # pylint:enable=line-too-long
      'rh100'
  ]

  shots = []
  for vector_asset_id in vector_asset_ids:
    fshots = ee.FeatureCollection(vector_asset_id).filterMetadata(
        'quality_flag', 'equals', 1)
    shots.append(fshots)

  shots = ee.FeatureCollection(shots).flatten()

  utm_zone_id = grid_cell_feature.get('grid_name').getInfo()
  crs = grid_cell_feature.get('crs').getInfo()

  month_start = datetime.datetime(year, month, 1)
  month_end = month_start + relativedelta.relativedelta(months=1)

  image_properties = {
      'month': month,
      'year': year,
      'version': 1,
      'system:time_start': timestamp_ms_for_datetime(month_start),
      'system:time_end': timestamp_ms_for_datetime(month_end),
  }

  image = (
      shots.sort('sensitivity', False).reduceToImage(
          props,
          ee.Reducer.first().forEach(props)).reproject(
              crs, None, 25).set(image_properties))

  task_name = f'L2A_Grid{grid_cell_id}_{utm_zone_id}_{year}_{month:02d}'

  box = grid_cell_feature.geometry().buffer(2500, 25).bounds()
  task = ee.batch.Export.image.toAsset(
      image=image.clip(box),
      description=task_name,
      assetId=f'{raster_collection}/{task_name}',
      region=box,
      pyramidingPolicy={'.default': 'sample'},
      scale=25,
      crs=crs,
      maxPixels=1e13)

  time.sleep(0.1)
  task.start()

  return task.status()['id']


def main(argv):
  start_id = 1  # First UTM grid cell id
  ee.Initialize()
  raster_collection = 'LARSE/GEDI/GEDI02_A_002_MONTHLY'

  for grid_cell_id in range(start_id, start_id + FLAGS.num_utm_grid_cells):
    grid_cell_feature = ee.Feature(
        ee.FeatureCollection(
            'users/yang/GEETables/GEDI/GEDI_UTM_GRIDS_LandOnly').filterMetadata(
                'grid_id', 'equals', grid_cell_id)).first()
    with open(argv[1]) as fh:
      rasterize_gedi_by_utm_zone(
          [x.strip() for x in fh], '%03d' % grid_cell_id, grid_cell_feature,
          raster_collection)


if __name__ == '__main__':
  app.run(main)
