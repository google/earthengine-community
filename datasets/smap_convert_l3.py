# Copyright 2022 The Google Earth Engine Community Authors
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

#This python code opens a single SMAP L3 HDF file and outputs a Geotiff in geographic projection
#
# requires pyl4c toolbox https://pypi.org/project/pyl4c/
#
# the output bands are as follows:
# 1) soil_moisture AM
# 2) tb_h_corrected AM
# 3) tb_v_corrected AM
# 4) vegetation_water_content AM
# 5) soil_moisture quality flag AM
# 6) tb_h_corrected quality flag AM
# 7) tb_v_corrected quality flag AM
# 8) soil_moisture PM
# 9) tb_h_corrected PM
# 10) tb_v_corrected PM
# 11) vegetation_water_content PM
# 12) soil_moisture quality flag PM
# 13) tb_h_corrected quality flag PM
# 14) tb_v_corrected quality flag PM
#
# where AM is 6:00 AM overpass and PM is 6:00 PM overpass
# quality flag of 0=good quality and flag=1 is bad quality
#
# Convert_SMAPL3_QA_EASEvsHDF5_GeoTiff_9km_AMPM.py
# written by Qing Liu, Arthur Endsley and Karyn Tabor
# last edited November 30, 2022 by Karyn Tabor


from absl import app
from osgeo import gdal
import glob
import os
import re
import numpy as np
from pyl4c.lib.modis import dec2bin_unpack
from pyl4c.spatial import array_to_raster
from pyl4c.data.fixtures import EASE2_GRID_PARAMS
from pyl4c.epsg import EPSG


# For the L3 data, the var list is very specific; the order matters
# for retrieving specific datasets
# 1:4 are data sets; 4 is SM QA; 5:6 is TB QA
VAR_LIST = [
    'soil_moisture', 'tb_h_corrected', 'tb_v_corrected',
    'vegetation_water_content', 'retrieval_qual_flag', 'tb_qual_flag_h',
    'tb_qual_flag_v'
]


def SMAP_retrievalQC_fail(x):
  """Returns pass/fail for QC flags.

    Returns pass/fail for QC flags based on the SMAP l3 QC protocol for the

    `retrieval_qual_flag` band: Bad pixels have either `1` in the first bit
    ("Soil
    moisture retrieval doesn't have recommended quality") or 1` in the third bit
    (Soil moisture retrieval was not successful").
    Output array is True wherever the array fails QC criteria. Compare to:

        np.vectorize(lambda v: v[0] == 1 or v[3:5] != '00')

    Parameters
    ----------
    x : numpy.ndarray
        Array where the last axis enumerates the unpacked bits
        (ones and zeros)
    example: c = dec2bin_unpack(np.array([2], dtype = np.uint8))
    Returns
    -------
    numpy.ndarray
        Boolean array with True wherever QC criteria are failed
       example Returns: array([[0, 0, 0, 0, 0, 0, 1, 0]], dtype=uint8)
  """
  y = dec2bin_unpack(x.astype(np.uint8))
  # Emit 1 = FAIL if 1st bit == 1
  # ("Soil moisture retrieval doesn't have recommended quality")
  c1 = y[...,7]
  #
  # Third bit is ==1 "Soil moisture retrieval was not successful"
  c2 = y[...,5]
  #
  # Intermediate arrays are 1 = FAIL, 0 = PASS
  return (c1 + c2) > 0


def SMAP_TB_QC_fail(x):
  """Returns pass/fail for QC flags.

  Returns pass/fail for QC flags based on the SMAPL3 QC protocol for the

  `tb_qual_flag_v'` and tb_qual_flag_h' layers: Bad pixels have either `1` in
  the first bit
  ("Observation does not have acceptable quality")
  Output array is True wherever the array fails QC criteria. Compare to:

      np.vectorize(lambda v: v[0] == 1 or v[3:5] != '00')

  Parameters
  ----------
  x : numpy.ndarray
      Array where the last axis enumerates the unpacked bits
      (ones and zeros)

  Returns
  -------
  numpy.ndarray
      Boolean array with True wherever QC criteria are failed
  """
  y = dec2bin_unpack(x.astype(np.uint8))
  # Emit 1 = FAIL if 1st bit == 1 ("Data has acceptable quality")
  c1 = y[...,7]
  # Intermediate arrays are 1 = FAIL, 0 = PASS
  return (c1) > 0


def convert(source_h5, target_tif):
  """Converts a SMAP L3 HDF file to a geotiff."""

  # Options for gdal_translate
  translate_options = gdal.TranslateOptions(
      format='GTiff',
      outputSRS='+proj=cea +lon_0=0 +lat_ts=30 +ellps=WGS84 +units=m',
      outputBounds=[-17367530.45, 7314540.11, 17367530.45, -7314540.11],
  )

  # array_to_raster params
  gt = EASE2_GRID_PARAMS['M09']['geotransform']
  wkt = EPSG[6933]
  tif_list =[]

  SMAP_opass = ['AM','PM']
  for i in range(0,2):
    print('SMAP overpass is %s' % (SMAP_opass[i]))
    if i == 1:
      #add '_pm' to all the variables in the list
      pass_var_list = [s + '_pm' for s in VAR_LIST]
      bnum=8
    else:
      pass_var_list = VAR_LIST
      bnum = 1

    # 'bnum' is the number to add to band to number the temp tiff
    # band 1 for am and 7 for pm

    # convert individual variables to separate GeoTiff files
    for iband in range(0,4):
      var = pass_var_list[iband]
      sds = gdal.Open(
          'HDF5:'+source_h5+'://Soil_Moisture_Retrieval_Data_'+SMAP_opass[i]+
          '/'+var)
      sds_array = sds.ReadAsArray()
      dst_tmp = '/tmp/tmp'+str(iband+bnum)+'.tif'
      sds_gdal = array_to_raster(sds_array,gt,wkt)
      ds = gdal.Translate(dst_tmp,sds_gdal,options=translate_options)
      ds = None
      tif_list.append(dst_tmp)

    # convert individual QA vars to separate GeoTiff files for Soil moisture
    iband=4
    var = pass_var_list[iband]

    sds = gdal.Open(
        'HDF5:'+source_h5+'://Soil_Moisture_Retrieval_Data_'+SMAP_opass[i]+
        '/'+var)
    sds_array = sds.ReadAsArray()
    dst_tmp = '/tmp/tmp'+str(iband+bnum)+'.tif'

    #Call to  QA function here
    qa = SMAP_retrievalQC_fail(sds_array).astype(np.uint8)
    qa_gdal = array_to_raster(qa,gt,wkt)
    ds = gdal.Translate(dst_tmp,qa_gdal,options=translate_options)
    ds = None
    tif_list.append(dst_tmp)

    # convert individual QA vars to separate GeoTiff files for TB

    for iband in range(5,7):
      var = pass_var_list[iband]

      sds = gdal.Open(
          'HDF5:'+source_h5+'://Soil_Moisture_Retrieval_Data_'+SMAP_opass[i]+
          '/'+var)
      sds_array = sds.ReadAsArray()
      dst_tmp = '/tmp/tmp'+str(iband+bnum)+'.tif'

      #Call to  QA function here
      qa = SMAP_TB_QC_fail(sds_array).astype(np.uint8)
      qa_gdal = array_to_raster(qa,gt,wkt)
      ds = gdal.Translate(dst_tmp,qa_gdal,options=translate_options)
      ds = None
      tif_list.append(dst_tmp)


  # build a VRT(Virtual Dataset) that includes the list of input tif files
  gdal.BuildVRT('/tmp/tmp.vrt', tif_list, options='-separate')

  warp_options = gdal.WarpOptions(
      creationOptions=['COMPRESS=LZW'],
      srcSRS='EPSG:6933',
      dstSRS='EPSG:4326',
      xRes=0.08,
      yRes=0.08,
      srcNodata=-9999,
      dstNodata=-9999
   )

  # run gdal_Warp to reproject the VRT data and save in the target tif file with
  # compression
  ds = gdal.Warp(target_tif, '/tmp/tmp.vrt', options=warp_options)
  ds = None

  # remove temporary files
  os.remove('/tmp/tmp.vrt')
  for f in tif_list:
    os.remove(f)


def main(argv):
  convert(argv[1], argv[2])


if __name__ == '__main__':
  app.run(main)
