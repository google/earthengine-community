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

from absl import app
from absl import logging
import h5py
import pandas as pd
import os

import gedi_lib

numeric_variables = (
    'beam',
    'degrade_flag',
    'delta_time',
    'digital_elevation_model',
    'digital_elevation_model_srtm',
    'elev_highestreturn',
    'elev_lowestmode',
    'elevation_bias_flag',
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
    'lon_highestreturn',
    'lon_lowestmode',

    'num_detectedmodes',
    'quality_flag',

    'selected_algorithm',
    'selected_mode',
    'selected_mode_flag',

    'sensitivity',
    'solar_azimuth',
    'solar_elevation',
    'surface_flag'
)

string_variables = ('shot_number',)

rh_names = tuple([f'rh{d}' for d in range(101)])


def extract_values(input_paths: list[str], output_path: str) -> None:
  """Extracts all rh (relative heights) from all algorithms and some qa flags.

  Args:
     input_paths: GEDI L2A and GEDI L2B file paths
     output_path: csv output file path
  """
  l2a_path = input_paths[0]
  l2b_path = input_paths[1]

  basename = os.path.basename(l2a_path)
  if not basename.startswith('GEDI') or not basename.endswith('.h5'):
    logging.error('Input path is not a GEDI filename: %s', l2a_path)
    return

  with h5py.File(l2a_path, 'r') as l2a_hdf_fh:
    with h5py.File(l2b_path, 'r') as l2b_hdf_fh:
      with open(output_path, 'w') as csv_fh:
        write_csv(l2a_hdf_fh, l2b_hdf_fh, csv_fh)


def write_csv(l2a_hdf_fh, l2b_hdf_fh, csv_file):
  """Writes a single CSV file based on the contents of HDF file."""
  is_first = True
  # Iterating over relative height percentage values from 0 to 100
  for k in l2a_hdf_fh.keys():
    if not k.startswith('BEAM'):
      continue
    print('\t', k)

    df = pd.DataFrame()

    for v in numeric_variables + string_variables:
      gedi_lib.hdf_to_df(l2a_hdf_fh, k, v, df)

    rh = pd.DataFrame(l2a_hdf_fh[f'{k}/rh'], columns=rh_names)
    df = pd.concat((df, rh), axis=1)

    gedi_lib.add_shot_number_breakdown(df)
    # Add the incidence angle variables from the corresponding L2B file.
    for l2b_var in gedi_lib.l2b_variables_for_l2a:
      gedi_lib.hdf_to_df(l2b_hdf_fh, k, 'geolocation/' + l2b_var, df)

    # Filter our rows with nan values for lat_lowestmode or lon_lowestmode.
    # Such rows are not ingestable into EE.
    df = df[df.lat_lowestmode.notnull()]
    df = df[df.lon_lowestmode.notnull()]

    df.to_csv(
        csv_file,
        float_format='%3.6f',
        index=False,
        header=is_first,
        mode='a',
        line_terminator='\n')
    is_first = False

def main(argv):
  extract_values(argv[1], argv[2])

if __name__ == '__main__':
  app.run(main)
