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
    'cover',
    'pai',
    'fhd_normal',
    'pgap_theta',
    'beam',
    'shot_number',
    'l2b_quality_flag',
    'algorithmrun_flag',
    'selected_rg_algorithm',
    'selected_l2a_algorithm',
    'sensitivity',
    'geolocation/degrade_flag',
    'geolocation/delta_time',
    'geolocation/lat_lowestmode',
    'geolocation/lon_lowestmode',
    'geolocation/local_beam_azimuth',
    'geolocation/local_beam_elevation',
    'geolocation/solar_azimuth',
    'geolocation/solar_elevation',
)


# pylint:disable=line-too-long
def extract_values(input_path, output_path):
  """Extracts all relative height values from all algorithms and some qa flags.

  Args:
     input_path: string, GEDI L2B file path
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
  # Iterating over metrics using a height profile defined for 30 slices.
  cover_names = [f'cover_z{d}' for d in range(30)]
  pai_names = [f'pai_z{d}' for d in range(30)]
  pavd_names = [f'pavd_z{d}' for d in range(30)]
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

    ds = hdf_fh[f'{k}/cover_z']
    cover_z = pd.DataFrame(ds, columns=cover_names)
    cover_z.replace(ds.attrs.get('_FillValue'), np.nan, True)

    ds = hdf_fh[f'{k}/pai_z']
    pai_z = pd.DataFrame(ds, columns=pai_names)
    pai_z.replace(ds.attrs.get('_FillValue'), np.nan, True)

    ds = hdf_fh[f'{k}/pavd_z']
    pavd_z = pd.DataFrame(ds, columns=pavd_names)
    pavd_z.replace(ds.attrs.get('_FillValue'), np.nan, True)

    df = pd.concat((df, cover_z), axis=1)
    df = pd.concat((df, pai_z), axis=1)
    df = pd.concat((df, pavd_z), axis=1)

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
