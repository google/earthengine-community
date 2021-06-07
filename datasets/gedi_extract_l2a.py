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
import numpy as np
import pandas as pd
import os

meta_variables = (
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
  """
  basename = os.path.basename(input_path)
  if not basename.startswith('GEDI') or not basename.endswith('.h5'):
    logging.error('Input path is not a GEDI filename: %s', input_path)
    return

  with h5py.File(input_path, 'r') as hdf_fh:
    with open(output_path, 'w') as csv_fh:
      write_csv(hdf_fh, csv_fh)


def write_csv(hdf_fh, csv_file):
  """Writes a single CSV file based on the contents of HDF file."""
  is_first = True
  # Iterating over relative height percentage values from 0 to 100
  rh_names = [f'rh{d}' for d in range(101)]
  for k in hdf_fh.keys():
    if not k.startswith('BEAM'):
      continue
    print('\t', k)

    df = pd.DataFrame()

    for v in meta_variables:
      if v.startswith('#'):
        continue

      name = v.split('/')[-1]
      ds = hdf_fh[f'{k}/{v}']
      values = ds[:]
      if issubclass(values.dtype.type, np.floating):
        values[values == ds.attrs.get('_FillValue')] = np.nan
      df[name] = values

    rh = pd.DataFrame(hdf_fh[f'{k}/rh'], columns=rh_names)

    df = pd.concat((df, rh), axis=1)
    # Filter our rows with nan values for lat_lowestmode or lon_lowestmode.
    # Such rows are not ingestable into EE.
    df = df[df.lat_lowestmode.notnull()]
    df = df[df.lon_lowestmode.notnull()]

    df.to_csv(csv_file, float_format='%3.6f', index=False, header=is_first, mode='a', line_terminator='\n')
    is_first = False

def main(argv):
  extract_values(argv[1], argv[2])

if __name__ == '__main__':
  app.run(main)
