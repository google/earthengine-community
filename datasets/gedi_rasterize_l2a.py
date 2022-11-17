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
from typing import Any

from absl import app
from absl import flags
import attr
from dateutil import relativedelta
import pytz

import ee
import gedi_lib

flags.DEFINE_integer('num_utm_grid_cells_l2a', 389, 'UTM grid cell count')
flags.DEFINE_bool(
    'allow_gedi_rasterize_l2a_overwrite', False,
    'Whether exported assets from gedi_rasterize_l2a are allowed to overwrite '
    'existing assets.')

FLAGS = flags.FLAGS


@attr.s
class ExportParameters:
  """Arguments for starting export jobs."""
  asset_id: str = attr.ib()
  image: Any = attr.ib()  # ee.Image
  pyramiding_policy: dict[str, str] = attr.ib()
  crs: str = attr.ib()
  region: Any = attr.ib()  # ee.Geometry.Polygon | ee.Geometry.LinearRing
  overwrite: bool = attr.ib()


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


def gedi_deltatime_epoch(dt):
  return dt.timestamp() - (datetime.datetime(2018, 1, 1) -
                           datetime.datetime(1970, 1, 1)).total_seconds()


def timestamp_ms_for_datetime(dt):
  return time.mktime(dt.timetuple()) * 1000


def parse_date_from_gedi_filename(table_asset_id):
  return pytz.utc.localize(
      datetime.datetime.strptime(
          os.path.basename(table_asset_id).split('_')[2], '%Y%j%H%M%S'))


def rasterize_gedi_by_utm_zone(table_asset_ids,
                               raster_asset_id,
                               grid_cell_feature,
                               grill_month,
                               overwrite=False):
  """Creates and runs an EE export job.

  Args:
    table_asset_ids: list of strings, table asset ids to rasterize
    raster_asset_id: string, raster asset id to create
    grid_cell_feature: ee.Feature
    grill_month: datetime, the 1st of the month for the data to be rasterized

  Returns:
    string, task id of the created task
  """

  export_params = create_export(table_asset_ids, raster_asset_id,
                                grid_cell_feature, grill_month, overwrite)
  return _start_task(export_params)


def create_export(table_asset_ids: list[str], raster_asset_id: str,
                  grid_cell_feature: Any, grill_month: datetime.datetime,
                  overwrite: bool) -> ExportParameters:
  """Creates an EE export job definition.

  Args:
    table_asset_ids: list of strings, table asset ids to rasterize
    raster_asset_id: string, raster asset id to create
    grid_cell_feature: ee.Feature
    grill_month: datetime.datetime
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
        'from %s to %s' % (month_start, month_end))
  right_month_dts = [
      dates for dates in table_asset_dts
      if dates >= month_start and dates < month_end
  ]
  if len(right_month_dts) / len(table_asset_dts) < 0.90:
    raise ValueError(
        'The majority of table ids are not in the requested month %s' %
        grill_month)

  # This is a subset of all available table properties.
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

  shots = []
  for table_asset_id in table_asset_ids:
    shots.append(ee.FeatureCollection(table_asset_id))
  box = grid_cell_feature.geometry().buffer(2500, 25).bounds()
  # month_start and month_end are converted to epochs using the
  # same temporal offset as "delta_time."
  # pytype: disable=attribute-error
  shots = ee.FeatureCollection(shots).flatten().filterBounds(box).filter(
      ee.Filter.rangeContains('delta_time', gedi_deltatime_epoch(month_start),
                              gedi_deltatime_epoch(month_end)))
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

  int_bands = [p for p in raster_bands if p in INTEGER_PROPS]
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


def main(argv):
  start_id = 1  # First UTM grid cell id
  ee.Initialize()
  raster_collection = 'LARSE/GEDI/GEDI02_A_002_MONTHLY'

  for grid_cell_id in range(start_id, start_id + FLAGS.num_utm_grid_cells_l2a):
    grid_cell_feature = ee.Feature(
        ee.FeatureCollection(
            'users/yang/GEETables/GEDI/GEDI_UTM_GRIDS_LandOnly').filterMetadata(
                'grid_id', 'equals', grid_cell_id)).first()
    with open(argv[1]) as fh:
      rasterize_gedi_by_utm_zone(
          [x.strip() for x in fh],
          raster_collection + '/' + '%03d' % grid_cell_id,
          grid_cell_feature,
          argv[2],
          overwrite=FLAGS.allow_gedi_rasterize_l2a_overwrite)


if __name__ == '__main__':
  app.run(main)
