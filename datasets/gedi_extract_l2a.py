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

#TODO: refactory write_csv to methods by h5 group. 
# The idea is to dynamically construct a dataframe by using predefined list of variables.
def write_csv(hdf_fh, csv_fh):
  """Writes a single CSV file based on the contents of HDF file."""
  is_first = True
  for k in hdf_fh.keys():
      if not k.startswith('BEAM'):
          continue
      print('\t',k)
      lat_lowestmode = hdf_fh[f'{k}/lat_lowestmode']
      lon_lowestmode = hdf_fh[f'{k}/lon_lowestmode']
      beam = hdf_fh[f'{k}/beam']
      channel = hdf_fh[f'{k}/channel']
      degrade_flag = hdf_fh[f'{k}/degrade_flag']
      delta_time = np.array(hdf_fh[f'{k}/delta_time']) #* 1000 + 1514764800000
      
      elev_highestreturn = hdf_fh[f'{k}/elev_highestreturn']
      elev_lowestmode = hdf_fh[f'{k}/elev_lowestmode']
      
      elevation_bias_flag = hdf_fh[f'{k}/elevation_bias_flag']
      elevation_bin0_error = hdf_fh[f'{k}/elevation_bin0_error']
      energy_total = hdf_fh[f'{k}/energy_total']

      # geolocation: see below for extraction by algorithms

      #land_cover_data
      landsat_treecover = hdf_fh[f'{k}/land_cover_data/landsat_treecover']
      modis_nonvegetated = hdf_fh[f'{k}/land_cover_data/modis_nonvegetated']
      modis_nonvegetated_sd = hdf_fh[f'{k}/land_cover_data/modis_nonvegetated_sd']
      modis_treecover = hdf_fh[f'{k}/land_cover_data/modis_treecover']
      modis_treecover_sd = hdf_fh[f'{k}/land_cover_data/modis_treecover_sd']

      lat_highestreturn = hdf_fh[f'{k}/lat_highestreturn']
      #lat_lowestmode: see lat above

      latitude_bin0_error = hdf_fh[f'{k}/latitude_bin0_error']

      lon_highestreturn = hdf_fh[f'{k}/lon_highestreturn']
      #lon_lowestmode: see lon above
      longitude_bin0_error = hdf_fh[f'{k}/longitude_bin0_error']

      master_frac = hdf_fh[f'{k}/master_frac']
      master_int = hdf_fh[f'{k}/master_int']
      mean_sea_surface = hdf_fh[f'{k}/mean_sea_surface']
      num_detectedmodes = hdf_fh[f'{k}/num_detectedmodes']

      quality_flag = hdf_fh[f'{k}/quality_flag']

      #rh: this is essentially rh_a1, ignore

      selected_algorithm = hdf_fh[f'{k}/selected_algorithm']
      selected_mode = hdf_fh[f'{k}/selected_mode']

      # should this be ignored
      sensitivity = hdf_fh[f'{k}/sensitivity']

      shot_number = hdf_fh[f'{k}/shot_number']
      solar_azimuth = hdf_fh[f'{k}/solar_azimuth']
      solar_elevation = hdf_fh[f'{k}/solar_elevation']
      surface_flag = hdf_fh[f'{k}/surface_flag']

      #group rx_1gaussfit
      rx_gamplitude = hdf_fh[f'{k}/rx_1gaussfit/rx_gamplitude']
      rx_gamplitude_error = hdf_fh[f'{k}/rx_1gaussfit/rx_gamplitude_error']
      rx_gbias = hdf_fh[f'{k}/rx_1gaussfit/rx_gbias']
      rx_gbias_error = hdf_fh[f'{k}/rx_1gaussfit/rx_gbias_error']
      rx_gchisq = hdf_fh[f'{k}/rx_1gaussfit/rx_gchisq']
      rx_gflag = hdf_fh[f'{k}/rx_1gaussfit/rx_gflag']
      rx_giters = hdf_fh[f'{k}/rx_1gaussfit/rx_giters']
      rx_gloc = hdf_fh[f'{k}/rx_1gaussfit/rx_gloc']
      rx_gloc_error = hdf_fh[f'{k}/rx_1gaussfit/rx_gloc_error']
      rx_gwidth = hdf_fh[f'{k}/rx_1gaussfit/rx_gwidth']
      rx_gwidth_error = hdf_fh[f'{k}/rx_1gaussfit/rx_gwidth_error']

      # These are single value array, ignoring
      # mpfit_max_func_evals = hdf_fh[f'{k}/rx_1gaussfit/ancillary/mpfit_max_func_evals']
      # mpfit_maxiters = hdf_fh[f'{k}/rx_1gaussfit/ancillary/mpfit_maxiters']
      # mpfit_tolerance = hdf_fh[f'{k}/rx_1gaussfit/ancillary/mpfit_tolerance']
      # rx_constraint_gamplitude_lower = hdf_fh[f'{k}/rx_1gaussfit/ancillary/rx_constraint_gamplitude_lower']
      # rx_constraint_gamplitude_upper = hdf_fh[f'{k}/rx_1gaussfit/ancillary/rx_constraint_gamplitude_upper']
      # rx_constraint_gloc_lower = hdf_fh[f'{k}/rx_1gaussfit/ancillary/rx_constraint_gloc_lower']
      # rx_constraint_gloc_upper = hdf_fh[f'{k}/rx_1gaussfit/ancillary/rx_constraint_gloc_upper']
      # rx_estimate_bias = hdf_fh[f'{k}/rx_1gaussfit/ancillary/rx_estimate_bias']
      # rx_mean_noise_level = hdf_fh[f'{k}/rx_1gaussfit/ancillary/rx_mean_noise_level']
      # rx_smoothwidth = hdf_fh[f'{k}/rx_1gaussfit/ancillary/rx_smoothwidth']

      #group rx_assess
      rx_assess_mean = hdf_fh[f'{k}/rx_assess/mean']
      rx_assess_mean_64kadjusted = hdf_fh[f'{k}/rx_assess/mean_64kadjusted']
      rx_assess_ocean_calibration_shot_flag = hdf_fh[f'{k}/rx_assess/ocean_calibration_shot_flag']
      rx_assess_quality_flag = hdf_fh[f'{k}/rx_assess/quality_flag']
      rx_assess_flag = hdf_fh[f'{k}/rx_assess/rx_assess_flag']
      rx_clipbin0 = hdf_fh[f'{k}/rx_assess/rx_clipbin0']
      rx_clipbin_count = hdf_fh[f'{k}/rx_assess/rx_clipbin_count']
      rx_energy = hdf_fh[f'{k}/rx_assess/rx_energy']
      rx_maxamp = hdf_fh[f'{k}/rx_assess/rx_maxamp']
      rx_maxpeakloc = hdf_fh[f'{k}/rx_assess/rx_maxpeakloc']
      sd_corrected = hdf_fh[f'{k}/rx_assess/sd_corrected']

      # These are single valued array, ignoring
      # rx_ampbounds_ll = hdf_fh[f'{k}/rx_assess/ancillary/rx_ampbounds_ll']
      # rx_ampbounds_ul = hdf_fh[f'{k}/rx_assess/ancillary/rx_ampbounds_ul']
      # rx_clipamp = hdf_fh[f'{k}/rx_assess/ancillary/rx_clipamp']
      # rx_pulsethresh = hdf_fh[f'{k}/rx_assess/ancillary/rx_pulsethresh']
      # rx_ringthresh = hdf_fh[f'{k}/rx_assess/ancillary/rx_ringthresh']
      # smoothing_width_locs = hdf_fh[f'{k}/rx_assess/ancillary/smoothing_width_locs']

      metadata = {
        "lat_lowestmode":                 lat_lowestmode,
        "lon_lowestmode":                 lon_lowestmode,
        "beam":                           beam,
        "channel":                        channel,
        "degrade_flag":                   degrade_flag,
        "delta_time":                     delta_time,
        "elev_highestreturn":             elev_highestreturn,
        "elev_lowestmode":                elev_lowestmode,
        "elevation_bias_flag":            elevation_bias_flag,
        "elevation_bin0_error":           elevation_bin0_error,
        "energy_total":                   energy_total,
        "landsat_treecover":              landsat_treecover,
        "modis_nonvegetated":             modis_nonvegetated,
        "modis_nonvegetated_sd":          modis_nonvegetated_sd,
        "modis_treecover":                modis_treecover,
        "modis_treecover_sd":             modis_treecover_sd,
        "lat_highestreturn":              lat_highestreturn,
        "latitude_bin0_error":            latitude_bin0_error,
        "lon_highestreturn":              lon_highestreturn,
        "longitude_bin0_error":           longitude_bin0_error,
        "master_frac":                    master_frac,
        "master_int":                     master_int,
        "mean_sea_surface":               mean_sea_surface,
        "num_detectedmodes":              num_detectedmodes,
        "quality_flag":                   quality_flag,
        "selected_algorithm":             selected_algorithm,
        "selected_mode":                  selected_mode,
        "sensitivity":                    sensitivity,
        "shot_number":                    shot_number,
        "solar_azimuth":                  solar_azimuth,
        "solar_elevation":                solar_elevation,
        "surface_flag":                   surface_flag,
        "rx_gamplitude":                  rx_gamplitude,
        "rx_gamplitude_error":            rx_gamplitude_error,
        "rx_gbias":                       rx_gbias,
        "rx_gbias_error":                 rx_gbias_error,
        "rx_gchisq":                      rx_gchisq,
        "rx_gflag":                       rx_gflag,
        "rx_giters":                      rx_giters,
        "rx_gloc":                        rx_gloc,
        "rx_gloc_error":                  rx_gloc_error,
        "rx_gwidth":                      rx_gwidth,
        "rx_gwidth_error":                rx_gwidth_error,
        "rx_assess_mean":                 rx_assess_mean,
        "rx_assess_mean_64kadjusted":     rx_assess_mean_64kadjusted,
        "rx_assess_ocean_calibration_sho":rx_assess_ocean_calibration_shot_flag,
        "rx_assess_quality_flag":         rx_assess_quality_flag,
        "rx_assess_flag":                 rx_assess_flag,
        "rx_clipbin0":                    rx_clipbin0,
        "rx_clipbin_count":               rx_clipbin_count,
        "rx_energy":                      rx_energy,
        "rx_maxamp":                      rx_maxamp,
        "rx_maxpeakloc":                  rx_maxpeakloc,
        "sd_corrected":                   sd_corrected
      }

      dataframe = pd.DataFrame(metadata)

      for a in range(1, 7):
          rh = hdf_fh[f'{k}/geolocation/rh_a{a}']
          qa = hdf_fh[f'{k}/geolocation/quality_flag_a{a}']

          rx_algrunflag = hdf_fh[f'{k}/rx_processing_a{a}/rx_algrunflag']
          zcross = hdf_fh[f'{k}/rx_processing_a{a}/zcross']
          toploc = hdf_fh[f'{k}/rx_processing_a{a}/toploc']

          rhq = np.column_stack((rh, qa, rx_algrunflag, zcross, toploc))
          names = [f'rh{x}_a{a}' for x in range(101)] + [f'quality_flag_a{a}',f'rx_algrunflag_a{a}',f'zcross_a{a}',f'toploc_a{a}']
          drhq = pd.DataFrame(rhq, columns=names)
          tmp = pd.concat((dataframe, drhq), axis=1)
          dataframe = tmp
          tmp = None

      dataframe.to_csv(csv_fh, float_format='%3.6f', index=False, header=is_first, line_terminator='\n')
      is_first = False
      dataframe = None

def main(argv):
  extract_values(argv[1], argv[2])

if __name__ == '__main__':
  app.run(main)