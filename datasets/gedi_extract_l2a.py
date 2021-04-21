"""
Copyright 2020 The Google Earth Engine Community Authors

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

from absl import app
from absl import logging
import h5py
import pandas as pd
import os

meta_variables = (
    'beam',
    'channel',
    'degrade_flag',
    'delta_time',
    'digital_elevation_model',
    'digital_elevation_model_srtm',
    'elev_highestreturn',
    'elev_lowestmode',
    'elevation_bias_flag',
    'elevation_bin0_error',
    'energy_total',

    'land_cover_data/landsat_treecover',
    'land_cover_data/landsat_water_persistence',
    'land_cover_data/leaf_off_doy',
    'land_cover_data/leaf_off_flag',
    'land_cover_data/leaf_on_cycle',
    'land_cover_data/leaf_on_doy',
    'land_cover_data/modis_nonvegetated',
    'land_cover_data/modis_nonvegetated_sd',
    'land_cover_data/modis_treecover',
    'land_cover_data/modis_treecover_sd',
    'land_cover_data/pft_class',
    'land_cover_data/region_class',
    'land_cover_data/urban_focal_window_size',
    'land_cover_data/urban_proportion',

    'lat_highestreturn',
    'lat_lowestmode',
    'latitude_bin0_error',
    'lon_highestreturn',
    'lon_lowestmode',
    'longitude_bin0_error',

    'master_frac',
    'master_int',
    'mean_sea_surface',
    'num_detectedmodes',
    'quality_flag',

    'rx_1gaussfit/rx_gamplitude',
    'rx_1gaussfit/rx_gamplitude_error',
    'rx_1gaussfit/rx_gbias',
    'rx_1gaussfit/rx_gbias_error',
    'rx_1gaussfit/rx_gchisq',
    'rx_1gaussfit/rx_gflag',
    'rx_1gaussfit/rx_giters',
    'rx_1gaussfit/rx_gloc',
    'rx_1gaussfit/rx_gloc_error',
    'rx_1gaussfit/rx_gwidth',
    'rx_1gaussfit/rx_gwidth_error',

    'rx_assess/mean',
    'rx_assess/mean_64kadjusted',
    'rx_assess/ocean_calibration_shot_flag',
    'rx_assess/quality_flag',
    'rx_assess/rx_assess_flag',
    'rx_assess/rx_clipbin0',
    'rx_assess/rx_clipbin_count',
    'rx_assess/rx_energy',
    'rx_assess/rx_maxamp',
    'rx_assess/rx_maxpeakloc',
    'rx_assess/sd_corrected',

    'selected_algorithm',
    'selected_mode',
    'selected_mode_flag',

    'sensitivity',
    'shot_number',
    'solar_azimuth',
    'solar_elevation',
    'surface_flag'
)

# pylint:disable=line-too-long
def extract_values(input_path, output_path):
  """Extracts all rh (relative height) values from all algorithms and some qa flags.

  Args:
     input_path: string, GEDI L2A file path
     output_path: string, csv output file path

  /BEAMXXXX/rx_assess/quality_flag == 1   L2A
  /BEAMXXXX/rx_assess/rx_maxamp > (8 * /BEAMXXXX/rx_assess/sd_corrected)  L2A Check with Michelle on lowering sd_corrected multiplier
  /BEAMXXXX/rx_processing_a<n>/rx_algrunflag == 1 L2A <n> is equal to the value of /BEAMXXXX/selected_algorithm
  /BEAMXXXX/rx_processing_a<n>/zcross > 0 L2A <n> is equal to the value of /BEAMXXXX/selected_algorithm
  /BEAMXXXX/rx_processing_a<n>/toploc > 0 L2A <n> is equal to the value of /BEAMXXXX/selected_algorithm
  /BEAMXXXX/sensitivity > 0   L2A
  /BEAMXXXX/sensitivity <= 1  L2A

  """
  basename = os.path.basename(input_path)
  if not basename.startswith('GEDI') or not basename.endswith('.h5'):
    logging.error('Input path is not a GEDI filename: %s', input_path)
    return

  with h5py.File(input_path, 'r') as hdf_fh:
    with open(output_path, 'w') as csv_fh:
      write_csv(hdf_fh, csv_fh)

# Number of different L2A algorithms.
# Moved to a function for stubbing out in tests.
def num_algorithms():
  return 6

# TODO(simonf): refactor write_csv to methods by h5 group.
# The idea is to dynamically construct a dataframe by using predefined list of variables.
def write_csv(hdf_fh, csv_fh):
  """Writes a single CSV file based on the contents of HDF file."""
  is_first = True
  rh_names = [f'rh{d}' for d in range(0, 101)]
  for k in hdf_fh.keys():
      if not k.startswith('BEAM'):
          continue
      print('\t',k)

      df = pd.DataFrame()

      for v in meta_variables:
          name = v.split('/')[-1]
          # print(v, '==>', name)

          df[name] = hdf_fh[f'{k}/{v}']

      rh = pd.DataFrame(hdf_fh[f'{k}/rh'], columns=rh_names)

      df = pd.concat((df, rh), axis=1)

      df.to_csv(csv_file, float_format='%3.6f', index=False, header=is_first, mode='a', line_terminator='\n')
      is_first = False
      df = None

def main(argv):
  extract_values(argv[1], argv[2])

if __name__ == '__main__':
  app.run(main)
