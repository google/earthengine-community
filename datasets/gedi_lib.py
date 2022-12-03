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

import os
import time
from typing import Any
from absl import flags
import attr
import h5py
import numpy as np
import pandas as pd

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
