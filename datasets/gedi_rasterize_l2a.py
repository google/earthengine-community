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

flags.DEFINE_integer('num_utm_grids', 389, 'UTM grid count')

FLAGS = flags.FLAGS


def timestamp_ms_for_datetime(dt):
  return time.mktime(dt.timetuple()) * 1000


def parse_date_from_gedi_filename(vector_asset_id):
  return pytz.utc.localize(
      datetime.datetime.strptime(
          os.path.basename(vector_asset_id).split('_')[2], '%Y%j%H%M%S'))


def rasterize_gedi_by_utm_zone(vector_asset_ids, grid_id, raster_collection):
  """Starts an Earth Engine task generating a raster asset covering a month."""
  datetimes = [parse_date_from_gedi_filename(x) for x in vector_asset_ids]
  if len(set(x.month for x in datetimes)) > 1:
    raise ValueError('Found more than one month in filenames')
  month = datetimes[0].month
  year = datetimes[0].year

  props = [
      'orbit', 'track', 'beam', 'channel', 'degrade', 'dtime', 'quality',
      'rx_algrunflag', 'rx_quality', 'sensitivity', 'toploc', 'zcross', 'rh10',
      'rh20', 'rh30', 'rh40', 'rh50', 'rh60', 'rh70', 'rh80', 'rh90', 'rh98'
  ]

  def updateOrbit(f):
    return (f.set('orbit', fshots.get('orbit'))
            .set('track', fshots.get('track')))

  shots = []
  for vector_asset_id in vector_asset_ids:
    fshots = ee.FeatureCollection(vector_asset_id).filterMetadata(
        'quality', 'equals', 1)
    augmented = fshots.map(updateOrbit)
    shots.append(augmented)

  shots = ee.FeatureCollection(shots).flatten()

  grid = (
      ee.FeatureCollection(
          'users/yang/GEETables/GEDI/GEDI_UTM_GRIDS_LandOnly').filterMetadata(
              'grid_id', 'equals', grid_id))

  zone_id = ee.Feature(grid.first()).get('grid_name').getInfo()
  crs = ee.Feature(grid.first()).get('crs').getInfo()

  month_start = datetime.datetime(year, month, 1)
  month_end = month_start + relativedelta.relativedelta(months=1)

  image_properties = {
      'month': month,
      'year': year,
      'grid_id': grid_id,
      'version': 1,
      'system:time_start': timestamp_ms_for_datetime(month_start),
      'system:time_end': timestamp_ms_for_datetime(month_end),
  }

  image = (
      shots.sort('sensitivity', False).reduceToImage(
          props,
          ee.Reducer.first().forEach(props)).reproject(
              crs, None, 25).set(image_properties))

  task_name = f'L2A_Grid{grid_id:03d}_{zone_id}_{year}_{month:02d}'

  box = grid.geometry().buffer(2500, 25).bounds()
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
  start_id = 1  # First UTM grid id
  ee.Initialize()
  raster_collection = 'projects/gee-gedi/assets/L2A_Raster'

  for grid_id in range(start_id, start_id + FLAGS.num_utm_grids):
    with open(argv[1]) as fh:
      rasterize_gedi_by_utm_zone(
          [x.strip() for x in fh], grid_id, raster_collection)


if __name__ == '__main__':
  app.run(main)
