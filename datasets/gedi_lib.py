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
from absl import flags
import attr
from dateutil import relativedelta
import h5py
import numpy as np
import pandas as pd
import pytz

import ee

l2b_variables_for_l2a = ('local_beam_azimuth', 'local_beam_elevation')


NUM_UTM_GRID_CELLS = flags.DEFINE_integer(
    'num_utm_grid_cells', 389, 'UTM grid cell count')

ALLOW_GEDI_RASTERIZE_OVERWRITE = flags.DEFINE_bool(
    'allow_gedi_rasterize_overwrite', False,
    'Whether exported assets from gedi_rasterize are allowed to overwrite '
    'existing assets.')


@attr.s
class ExportParameters:
  """Arguments for starting export jobs."""
  asset_id: str = attr.ib()
  image: Any = attr.ib()  # ee.Image
  pyramiding_policy: dict[str, str] = attr.ib()
  crs: str = attr.ib()
  region: Any = attr.ib()  # ee.Geometry.Polygon | ee.Geometry.LinearRing
  overwrite: bool = attr.ib()


def _start_task(export_params: ExportParameters) -> str:
  """Starts an EE export task with the given parameters."""
  asset_id = export_params.asset_id
  task = ee.batch.Export.image.toAsset(
      image=export_params.image,
      description=os.path.basename(asset_id),
      assetId=asset_id,
      region=export_params.region,
      pyramidingPolicy=export_params.pyramiding_policy,
      scale=25,
      crs=export_params.crs,
      maxPixels=1e13,
      overwrite=export_params.overwrite)

  time.sleep(0.1)
  task.start()
  return task.status()['id']


def rasterize_gedi_by_utm_zone(table_asset_ids,
                               raster_asset_id,
                               grid_cell_feature,
                               grill_month,
                               export_function,
                               overwrite=False):
  """Creates and runs an EE export job.

  Args:
    table_asset_ids: list of strings, table asset ids to rasterize
    raster_asset_id: string, raster asset id to create
    grid_cell_feature: ee.Feature
    grill_month: datetime, the 1st of the month for the data to be rasterized
    export_function: function to create export
    overwrite: bool, if any of the assets can be replaced if they already exist

  Returns:
    string, task id of the created task
  """
  export_params = export_function(table_asset_ids, raster_asset_id,
                                  grid_cell_feature, grill_month, overwrite)
  return _start_task(export_params)


def add_shot_number_breakdown(df: pd.DataFrame) -> None:
  """Adds fields obtained by breaking down shot_number.

  Example: from 154341234599141100 we obtain:
    orbit_number = 15434
    beam_number = 12 (we ignore it)
    minor_frame_number = 345
    shot_number_within_beam = 99141101

  Args:
    df: pd.DataFrame
  """
  # It's simpler to use substrings than to do math.
  df['shot_number_within_beam'] = [
      int(str(x)[-8:]) for x in df['shot_number']]
  df['minor_frame_number'] = [int(str(x)[-11:-8]) for x in df['shot_number']]
  # beam number, [-13:-11], is already in the 'beam' property
  df['orbit_number'] = [int(str(x)[:-13]) for x in df['shot_number']]


def hdf_to_df(
    hdf_fh: h5py.File, beam_key: str, var: str, df: pd.DataFrame) -> None:
  """Copies data for a single var from an HDF file to a Pandas DataFrame.

  Args:
    hdf_fh: h5 file handle
    beam_key: a string like BEAM0110, first part of the HDF variable key
    var: second part of the HDF variable key (also used for the dataframe key)
    df: output Pandsa DataFrame
  """
  if var.startswith('#'):
    return
  hdf_key = f'{beam_key}/{var}'
  df_key = var.split('/')[-1]

  ds = hdf_fh[hdf_key]
  df[df_key] = ds[:]
  if len(df[df_key]) and isinstance(df[df_key][0], bytes):
    df[df_key] = df[df_key].apply(lambda x: x.decode())
  df[df_key].replace([np.inf, -np.inf], np.nan, inplace=True)
  if ds.attrs.get('_FillValue') is not None:
    # We need to use pd.NA that works with integer types (np.nan does not)
    df[df_key].replace(ds.attrs.get('_FillValue'), pd.NA, inplace=True)


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
    raster_bands: list[str],
    int_bands: list[str],
    grid_cell_feature: Any,
    grill_month: datetime.datetime,
    overwrite: bool) -> ExportParameters:
  """Creates an EE export job definition.

  Args:
    table_asset_ids: list of strings, table asset ids to rasterize
    raster_asset_id: string, raster asset id to create
    raster_bands: list of raster bands,
    int_bands: list of integer bands
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
  if len(right_month_dts) / len(table_asset_dts) < 0.55:
    raise ValueError(
        'The majority of table ids are not in the requested month %s' %
        grill_month)

  shots = []
  for table_asset_id in table_asset_ids:
    shots.append(ee.FeatureCollection(table_asset_id))

  box = grid_cell_feature.geometry().buffer(2500, 25).bounds()
  # month_start and month_end are converted to epochs using the
  # same temporal offset as "delta_time."
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

  # This keeps the original (alphabetic) band order.
  image_with_types = image.toDouble().addBands(
      image.select(int_bands).toInt(), overwrite=True)

  return ExportParameters(
      asset_id=raster_asset_id,
      image=image_with_types.clip(box),
      pyramiding_policy={'.default': 'sample'},
      crs=crs,
      region=box,
      overwrite=overwrite)
