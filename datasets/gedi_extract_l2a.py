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


def write_csv(hdf_fh, csv_fh):
  """Writes a single CSV file based on the contents of HDF file."""
  is_first = True
  for k in hdf_fh.keys():
    if not k.startswith('BEAM'):
      continue
    print('\t', k)
    lat = hdf_fh[f'{k}/lat_lowestmode']
    lon = hdf_fh[f'{k}/lon_lowestmode']
    beam = hdf_fh[f'{k}/beam']
    channel = hdf_fh[f'{k}/channel']
    degrade_flag = hdf_fh[f'{k}/degrade_flag']
    delta_time = np.array(hdf_fh[f'{k}/delta_time'])  #* 1000 + 1514764800000
    elev_lowestmode = hdf_fh[f'{k}/elev_lowestmode']
    master_int = hdf_fh[f'{k}/master_int']
    master_fact = hdf_fh[f'{k}/master_frac']
    quality_flag = hdf_fh[f'{k}/quality_flag']
    selected_algorithm = hdf_fh[f'{k}/selected_algorithm']
    sensitivity = hdf_fh[f'{k}/sensitivity']
    shot_number = hdf_fh[f'{k}/shot_number']
    solar_azimuth = hdf_fh[f'{k}/solar_azimuth']
    solar_elevation = hdf_fh[f'{k}/solar_elevation']
    surface_flag = hdf_fh[f'{k}/surface_flag']

    rx_access_quality_flag = hdf_fh[f'{k}/rx_assess/quality_flag']

    metadata = {
        'lon': lon,
        'lat': lat,
        'beam': beam,
        'channel': channel,
        'delta_time': delta_time,
        'degrade_flag': degrade_flag,
        'elev_lowestmode': elev_lowestmode,
        'master_int': master_int,
        'master_fact': master_fact,
        'quality_flag': quality_flag,
        'selected_algorithm': selected_algorithm,
        'sensitivity': sensitivity,
        'shot_number': shot_number,
        'solar_azimuth': solar_azimuth,
        'solar_elevation': solar_elevation,
        'surface_flag': surface_flag,
        'rx_assess_quality_flag': rx_access_quality_flag
    }

    dataframe = pd.DataFrame(metadata)

    for a in range(1, 1 + num_algorithms()):
      rh = hdf_fh[f'{k}/geolocation/rh_a{a}']
      qa = hdf_fh[f'{k}/geolocation/quality_flag_a{a}']

      rx_algrunflag = hdf_fh[f'{k}/rx_processing_a{a}/rx_algrunflag']
      zcross = hdf_fh[f'{k}/rx_processing_a{a}/zcross']
      toploc = hdf_fh[f'{k}/rx_processing_a{a}/toploc']

      rhq = np.column_stack((rh, qa, rx_algrunflag, zcross, toploc))
      names = [f'rh{x}_a{a}' for x in range(101)] + [
          f'quality_flag_a{a}', f'rx_algrunflag_a{a}', f'zcross_a{a}',
          f'toploc_a{a}'
      ]
      drhq = pd.DataFrame(rhq, columns=names)
      tmp = pd.concat((dataframe, drhq), axis=1)
      dataframe = tmp
      tmp = None

    dataframe.to_csv(
        csv_fh,
        float_format='%3.6f',
        index=False,
        header=is_first,
        line_terminator='\n')
    is_first = False
    dataframe = None


def main(argv):
  extract_values(argv[1], argv[2])

if __name__ == '__main__':
  app.run(main)
