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
import gedi_lib


# From https://lpdaac.usgs.gov/products/gedi02_av002/
# We list all known property names for safety, even though we might not
# be currently using all of them during rasterization.
INTEGER_PROPS = frozenset({
    'beam',
    'channel',
    'degrade_flag',
    'elevation_bias_flag',
    'enable_select_mode',
    'l2a_alg_count',
    'landsat_water_persistence',
    'leaf_off_doy',
    'leaf_off_flag',
    'leaf_on_cycle',
    'leaf_on_doy',
    'master_int',
    'num_detectedmodes',
    'num_detectedmodes_aN',
    'ocean_calibration_shot_flag',
    'pft_class',
    'quality_flag',
    'quality_flag_aN',
    'region_class',
    'rh_aN',
    'rx_algrunflag',
    'rx_assess_flag',
    'rx_clipbin0',
    'rx_clipbin_count',
    'rx_estimate_bias',
    'rx_gflag',
    'rx_giters',
    'rx_maxpeakloc',
    'rx_nummodes',
    'rx_use_fixed_thresholds',
    'selected_algorithm',
    'selected_mode',
    'selected_mode_flag',
    # Note that 'shot_number' is a long ingested as a string, so
    # we don't rasterize it.
    'stale_return_flag',
    'state_return_flag',
    'surface_flag',
    'toploc_miss',
    'urban_focal_window_size',
    'urban_proportion',
    # Fields added by splitting shot_number
    'minor_frame_number',
    'orbit_number',
    'shot_number_within_beam',
})

raster_bands = (
    'beam',
    'degrade_flag',
    'delta_time',
    'digital_elevation_model',
    'digital_elevation_model_srtm',
    'elev_highestreturn',
    'elev_lowestmode',
    'elevation_bias_flag',
    'energy_total',
    'landsat_treecover',
    'landsat_water_persistence',
    'lat_highestreturn',
    'leaf_off_doy',
    'leaf_off_flag',
    'leaf_on_cycle',
    'leaf_on_doy',
    'lon_highestreturn',
    'modis_nonvegetated',
    'modis_nonvegetated_sd',
    'modis_treecover',
    'modis_treecover_sd',
    'num_detectedmodes',
    'pft_class',
    'quality_flag',
    'region_class',
    'selected_algorithm',
    'selected_mode',
    'selected_mode_flag',
    'sensitivity',
    'solar_azimuth',
    'solar_elevation',
    'surface_flag',
    'urban_focal_window_size',
    'urban_proportion',
    'rh0',
    'rh1',
    'rh2',
    'rh3',
    'rh4',
    'rh5',
    'rh6',
    'rh7',
    'rh8',
    'rh9',
    # pylint:disable=line-too-long
    'rh10',
    'rh11',
    'rh12',
    'rh13',
    'rh14',
    'rh15',
    'rh16',
    'rh17',
    'rh18',
    'rh19',
    'rh20',
    'rh21',
    'rh22',
    'rh23',
    'rh24',
    'rh25',
    'rh26',
    'rh27',
    'rh28',
    'rh29',
    'rh30',
    'rh31',
    'rh32',
    'rh33',
    'rh34',
    'rh35',
    'rh36',
    'rh37',
    'rh38',
    'rh39',
    'rh40',
    'rh41',
    'rh42',
    'rh43',
    'rh44',
    'rh45',
    'rh46',
    'rh47',
    'rh48',
    'rh49',
    'rh50',
    'rh51',
    'rh52',
    'rh53',
    'rh54',
    'rh55',
    'rh56',
    'rh57',
    'rh58',
    'rh59',
    'rh60',
    'rh61',
    'rh62',
    'rh63',
    'rh64',
    'rh65',
    'rh66',
    'rh67',
    'rh68',
    'rh69',
    'rh70',
    'rh71',
    'rh72',
    'rh73',
    'rh74',
    'rh75',
    'rh76',
    'rh77',
    'rh78',
    'rh79',
    'rh80',
    'rh81',
    'rh82',
    'rh83',
    'rh84',
    'rh85',
    'rh86',
    'rh87',
    'rh88',
    'rh89',
    'rh90',
    'rh91',
    'rh92',
    'rh93',
    'rh94',
    'rh95',
    'rh96',
    'rh97',
    'rh98',
    'rh99',
    # pylint:enable=line-too-long
    'rh100',
    'minor_frame_number',
    'orbit_number',
    'shot_number_within_beam',
) + gedi_lib.l2b_variables_for_l2a


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
      raster_bands=list(raster_bands),
      int_bands=int_bands,
      grid_cell_feature=grid_cell_feature,
      grill_month=grill_month,
      overwrite=overwrite)


def main(argv):
  start_id = 1  # First UTM grid cell id
  ee.Initialize()
  raster_collection = 'LARSE/GEDI/GEDI02_A_002_MONTHLY'

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
