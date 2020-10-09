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
import h5py
import numpy as np
import pandas as pd
import os


# pylint:disable=line-too-long
def rhv(h5file, csv_fh):
  """Extracts rh values and some qa flags.

  Args:
     h5file: string, GEDI L2A file path
     csv_fh: csv file handle

  /BEAMXXXX/rx_assess/quality_flag == 1   L2A
  /BEAMXXXX/rx_assess/rx_maxamp > (8 * /BEAMXXXX/rx_assess/sd_corrected)  L2A Check with Michelle on lowering sd_corrected multiplier
  /BEAMXXXX/rx_processing_a<n>/rx_algrunflag == 1 L2A <n> is equal to the value of /BEAMXXXX/selected_algorithm
  /BEAMXXXX/rx_processing_a<n>/zcross > 0 L2A <n> is equal to the value of /BEAMXXXX/selected_algorithm
  /BEAMXXXX/rx_processing_a<n>/toploc > 0 L2A <n> is equal to the value of /BEAMXXXX/selected_algorithm
  /BEAMXXXX/sensitivity > 0   L2A
  /BEAMXXXX/sensitivity <= 1  L2A

  In this implementaiton, assume that all the shots in rh are using
  the same algorithm.

  """
  f = h5py.File(h5file)
  fmt = '%3.6f,%3.6f,%d,%8.4f,%3.2f'
  with open(csv_fh, 'w') as oufh:
    # oufh.writelines('lon,lat,rh98\n')
    #oufh.writelines('lon,lat,beam,channel,acquisition_date,rh98\n')
    is_first = True
    for k in f.keys():
      if not k.startswith('BEAM'):
        continue
      print('\t',k)
      lat = f[f'{k}/lat_lowestmode']
      lon = f[f'{k}/lon_lowestmode']
      beam = f[f'{k}/beam']
      channel = f[f'{k}/channel']
      #dtime = np.array(f[f'{k}/delta_time']) * 1000 + 1514764800000
      dtime = np.array(f[f'{k}/delta_time']) + 1514764800
      degrade = f[f'{k}/degrade_flag']
      quality = f[f'{k}/quality_flag']
      sensitivity = f[f'{k}/sensitivity']
      rx_quality = f[f'{k}/rx_assess/quality_flag']

      # assuming all shots using the same alborithm, randomly picked
      # the 1000th indexed element
      algorithm = f[f'{k}/selected_algorithm'][1000]
      rx_algrunflag = f[f'{k}/rx_processing_a{algorithm}/rx_algrunflag']
      zcross = f[f'{k}/rx_processing_a{algorithm}/zcross']
      toploc = f[f'{k}/rx_processing_a{algorithm}/toploc']

      rh = f[f'{k}/rh']
      quantiles = (10,20,30,40,50,60,70,80,90,98)
      rh = rh[:, quantiles]

      names = [f'rh{x}' for x in quantiles]
      drh = pd.DataFrame(rh, columns=names)

      ds = {'lon': lon,
            'lat': lat,
            'beam': beam,
            'channel': channel,
            'dtime': dtime,
            'degrade': degrade,
            'quality': quality,
            'sensitivity': sensitivity,
            'rx_quality': rx_quality,
            'rx_algrunflag': rx_algrunflag,
            'zcross': zcross,
            'toploc': toploc
            }

      df = pd.DataFrame(ds)

      tmp = pd.concat((df, drh), axis=1)

      tmp.to_csv(
          oufh, float_format='%3.6f', index=False, header=is_first,
          line_terminator='\n')
      is_first = False
      df = None


def process_all(dat_dir, out_dir):
  for f in os.listdir(dat_dir):
    print('extracting', f)
    if f.startswith('GEDI') and f.endswith('.h5'):
      oufh = os.path.join(out_dir, f'{f.replace(".h5", ".csv")}')
      if os.path.exists(oufh):
        continue

      rhv(os.path.join(dat_dir, f), oufh)


def main(argv):
  dat_dir = argv[1]
  out_dir = '/tmp'
  print(dat_dir)
  process_all(dat_dir, out_dir)
  print('all done!')


if __name__ == '__main__':
  app.run(main)
