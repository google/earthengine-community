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
from typing import Any

from absl import app

import ee
from google3.pyglib.function_utils import memoize
import gedi_lib


# From https://lpdaac.usgs.gov/products/gedi02_av002/
# We list all known property names for safety, even though we might not
# be currently using all of them during rasterization.
INTEGER_PROPS = frozenset({
    'algorithmrun_flag',
    'algorithmrun_flag_aN',
    'channel',
    'degrade_flag',
    'l2a_quality_flag',
    'l2b_quality_flag',
    'landsat_water_persistencoe',
    'leaf_off_flag',
    'leaf_on_cycle',
    'master_int',
    'num_detectedmodes',
    'pft_class',
    'region_class',
    'rg_eg_constraint_center_buffer',
    'rg_eg_flag_aN',
    'rg_eg_niter_aN',
    'selected_l2a_algorithm',
    'selected_mode',
    'selected_mode_flag',
    'selected_rg_algorithm',
    # Note that 'shot_number' is a long ingested as a string, so
    # we don't rasterize it.
    'stale_return_flag',
    'surface_flag',
    'urban_focal_window_size',
    'urban_proportion',
    # Fields added by splitting shot_number
    'minor_frame_number',
    'orbit_number',
    'shot_number_within_beam',
})


@memoize.Memoize()
def get_raster_bands(band):
  return [band + str(count) for count in range(30)]

# This is a subset of all available table properties.
raster_bands = [
    'algorithmrun_flag', 'beam', 'cover'
] + get_raster_bands('cover_z') + [
    'degrade_flag', 'delta_time', 'fhd_normal', 'l2b_quality_flag',
    'local_beam_azimuth', 'local_beam_elevation', 'pai'
] + get_raster_bands('pai_z') + get_raster_bands('pavd_z') + [
    'pgap_theta', 'selected_l2a_algorithm', 'selected_rg_algorithm',
    'sensitivity', 'solar_azimuth', 'solar_elevation',
    'minor_frame_number', 'orbit_number', 'shot_number_within_beam'
]

int_bands = [p for p in raster_bands if p in INTEGER_PROPS]


def export_wrapper(table_asset_ids: list[str], raster_asset_id: str,
                   grid_cell_feature: Any, grill_month: datetime.datetime,
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
  return gedi_lib.create_export(
      table_asset_ids=table_asset_ids,
      raster_asset_id=raster_asset_id,
      raster_bands=raster_bands,
      int_bands=int_bands,
      grid_cell_feature=grid_cell_feature,
      grill_month=grill_month,
      overwrite=overwrite)


def main(argv):
  start_id = 1  # First UTM grid cell id
  ee.Initialize()
  raster_collection = 'LARSE/GEDI/GEDI02_B_002_MONTHLY'

  for grid_cell_id in range(start_id,
                            start_id + gedi_lib.NUM_UTM_GRID_CELLS.value):
    grid_cell_feature = ee.Feature(
        ee.FeatureCollection(
            'users/yang/GEETables/GEDI/GEDI_UTM_GRIDS_LandOnly').filterMetadata(
                'grid_id', 'equals', grid_cell_id).first())
    with open(argv[1]) as fh:
      gedi_lib.rasterize_gedi_by_utm_zone(
          [x.strip() for x in fh],
          raster_collection + '/' + '%03d' % grid_cell_id,
          grid_cell_feature,
          argv[2],
          export_wrapper,
          overwrite=gedi_lib.ALLOW_GEDI_RASTERIZE_OVERWRITE.value)


if __name__ == '__main__':
  app.run(main)
