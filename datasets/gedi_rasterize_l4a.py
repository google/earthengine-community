# Copyright 2020 The Google Earth Engine Community Authors
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

import datetime
import os
import time
from typing import Any

from absl import app
from dateutil import relativedelta
import pytz

import ee
from google3.pyglib.function_utils import memoize
from google3.third_party.earthengine_community.datasets import gedi_extract_l4a
import gedi_lib

# From https://lpdaac.usgs.gov/products/gedi02_av002/
# We list all known property names for safety, even though we might not
# be currently using all of them during rasterization.
INTEGER_PROPS = (
    gedi_extract_l4a.numeric_variables +
    gedi_extract_l4a.group_var_dict['agbd_prediction'] +
    gedi_extract_l4a.group_var_dict['geolocation'] +
    gedi_extract_l4a.group_var_dict['land_cover_data'])


def gedi_deltatime_epoch(dt):
  return dt.timestamp() - (datetime.datetime(2018, 1, 1) -
                           datetime.datetime(1970, 1, 1)).total_seconds()


def timestamp_ms_for_datetime(dt):
  return time.mktime(dt.timetuple()) * 1000


def parse_date_from_gedi_filename(table_asset_id):
  return pytz.utc.localize(
      datetime.datetime.strptime(
          os.path.basename(table_asset_id).split('_')[2], '%Y%j%H%M%S'))


def create_export(
    table_asset_ids: list[str],
    raster_asset_id: str,
    grid_cell_feature: Any,
    grill_month: datetime.datetime,
    overwrite: bool) -> gedi_lib.ExportParameters:
  """Creates an EE export job definition.

  Args:
    table_asset_ids: list of strings, table asset ids to rasterize
    raster_asset_id: string, raster asset id to create
    grid_cell_feature: ee.Feature
    grill_month: grilled month
    overwrite: bool, if any of the assets can be replaced if they already exist

  Returns:
    an ExportParameters object containing arguments for an export job.
  """
  if not table_asset_ids:
    raise ValueError('No table asset ids specified')
  table_asset_dts = []
  for asset_id in table_asset_ids:
    date_obj = parse_date_from_gedi_filename(asset_id)
    table_asset_dts.append(date_obj)
  # pylint:disable=g-tzinfo-datetime
  # We don't care about pytz problems with DST - this is just UTC.
  month_start = grill_month.replace(day=1)
  # pylint:enable=g-tzinfo-datetime
  month_end = month_start + relativedelta.relativedelta(months=1)
  if all((date < month_start or date >= month_end) for date in table_asset_dts):
    raise ValueError(
        'ALL the table files are outside of the expected month that is ranging'
        ' from %s to %s' % (month_start, month_end))

  right_month_dts = [
      dates for dates in table_asset_dts
      if dates >= month_start and dates < month_end
  ]
  if len(right_month_dts) / len(table_asset_dts) < 0.95:
    raise ValueError(
        'The majority of table ids are not in the requested month %s' %
        grill_month)

  @memoize.Memoize()
  def get_raster_bands(band):
    return [band + str(count) for count in range(30)]

  raster_bands = list(INTEGER_PROPS)

  shots = []
  for table_asset_id in table_asset_ids:
    shots.append(ee.FeatureCollection(table_asset_id))

  box = grid_cell_feature.geometry().buffer(2500, 25).bounds()
  # month_start and month_end are converted to epochs using the
  # same scale as "delta_time."
  # pytype: disable=attribute-error
  shots = ee.FeatureCollection(shots).flatten().filterBounds(box).filter(
      ee.Filter.rangeContains(
          'delta_time',
          gedi_deltatime_epoch(month_start),
          gedi_deltatime_epoch(month_end))
    )
  # pytype: enable=attribute-error
  # We use ee.Reducer.first() below, so this will pick the point with the
  # higherst sensitivity.
  shots = shots.sort('sensitivity', False)

  crs = grid_cell_feature.get('crs').getInfo()

  image_properties = {
      'month': grill_month.month,
      'year': grill_month.year,
      'version': 1,
      'system:time_start': timestamp_ms_for_datetime(month_start),
      'system:time_end': timestamp_ms_for_datetime(month_end),
      'table_asset_ids': table_asset_ids
  }

  image = (
      shots.sort('sensitivity', False).reduceToImage(
          raster_bands,
          ee.Reducer.first().forEach(raster_bands)).reproject(
              crs, None, 25).set(image_properties))

  int_bands = list(INTEGER_PROPS)
  # This keeps the original (alphabetic) band order.
  image_with_types = image.toDouble().addBands(
      image.select(int_bands).toInt(), overwrite=True)

  return gedi_lib.ExportParameters(
      asset_id=raster_asset_id,
      image=image_with_types.clip(box),
      pyramiding_policy={'.default': 'sample'},
      crs=crs,
      region=box,
      overwrite=overwrite)


def main(argv):
  start_id = 1  # First UTM grid cell id
  ee.Initialize()
  raster_collection = 'LARSE/GEDI/GEDI04_A_002_MONTHLY'
  for grid_cell_id in range(start_id,
                            start_id + gedi_lib.NUM_UTM_GRID_CELLS.value):
    grid_cell_feature = ee.Feature(
        ee.FeatureCollection(
            'users/yang/GEETables/GEDI/GEDI_UTM_GRIDS_LandOnly').filterMetadata(
                'grid_id', 'equals', grid_cell_id)).first()
    with open(argv[1]) as fh:
      gedi_lib.rasterize_gedi_by_utm_zone(
          [x.strip() for x in fh],
          raster_collection + '/' + '%03d' % grid_cell_id,
          grid_cell_feature,
          argv[2],
          create_export,
          overwrite=gedi_lib.ALLOW_GEDI_RASTERIZE_OVERWRITE.value)


if __name__ == '__main__':
  app.run(main)
