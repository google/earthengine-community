#This python code opens a single SMAP L4 HDF file and outputs a Geotiff in geographic projection
#
# requires pyl4c toolbox https://pypi.org/project/pyl4c/
#
# the output bands are as follows:
# 1) sm_surface
# 2) sm_rootzone
# 3) sm_profile
# 4) sm_surface_wetness
# 5) sm_rootzone_wetness
# 6) sm_profile_wetness
# 7) surface_temp
# 8) soil_temp_layer1
# 9) soil_temp_layer2
# 10) soil_temp_layer3
# 11) soil_temp_layer4
# 12) soil_temp_layer5
# 13) soil_temp_layer6 
# 14) snow_mass
# 15) snow_depth
# 16) land_evapotranspiration_flux
# 17) overland_runoff_flux
# 18) baseflow_flux
# 19) snow_melt_flux
# 20) soil_water_infiltration_flux
# 21) land_fraction_saturated
# 22) land_fraction_unsaturated
# 23) land_fraction_wilting
# 24) land_fraction_snow_covered
# 25) heat_flux_sensible
# 26) heat_flux_latent
# 27) heat_flux_ground
# 28) net_downward_shortwave_flux
# 29) net_downward_longwave_flux
# 30) radiation_shortwave_downward_flux
# 31) radiation_longwave_absorbed_flux
# 32) precipitation_total_surface_flux
# 33) snowfall_surface_flux
# 34) surface_pressure
# 35) height_lowatmmodlay
# 36) temp_lowatmmodlay
# 37) specific_humidity_lowatmmodlay
# 38) windspeed_lowatmmodlay
# 39) vegetation_greenness_fraction
# 40) leaf_area_index
# 41) sm_rootzone_pctl
# 42) sm_profile_pctl
# 43) depth_to_water_table_from_surface_in_peat
# 44) free_surface_water_on_peat_flux
# 45) mwrtm_vegopacity

# Convert_SMAPL4_EASEvsHDF5_GeoTiff.py
# written by Qing Liu, Aurthur Endsley, and Karyn Tabor
# last edited November 30, 2022 by Karyn Tabor


#module load python/MINIpyD/3.9  # NCCS module 
from osgeo import gdal
import glob
import os
import re
import numpy as np
from pyl4c.lib.modis import dec2bin_unpack
from pyl4c.spatial import array_to_raster
from pyl4c.data.fixtures import EASE2_GRID_PARAMS
from pyl4c.epsg import EPSG

# function to convert single EASEv2 h5 file to GeoTiff file with multiple
# variables.
in_hdf = '/Users/ktabor/Documents/SMAP/DATA/L4/SMAP_L4_SM_gph_20221120T013000_Vv7030_001.h5'

var_list = ['sm_surface','sm_rootzone','sm_profile','sm_surface_wetness','sm_rootzone_wetness',\
            'sm_profile_wetness','surface_temp','soil_temp_layer1','soil_temp_layer2','soil_temp_layer3', \
            'soil_temp_layer4','soil_temp_layer5','soil_temp_layer6','snow_mass','snow_depth', \
            'land_evapotranspiration_flux','overland_runoff_flux','baseflow_flux','snow_melt_flux', \
            'soil_water_infiltration_flux','land_fraction_saturated','land_fraction_unsaturated', \
            'land_fraction_wilting','land_fraction_snow_covered','heat_flux_sensible','heat_flux_latent',\
            'heat_flux_ground','net_downward_shortwave_flux','net_downward_longwave_flux', \
            'radiation_shortwave_downward_flux','radiation_longwave_absorbed_flux',\
            'precipitation_total_surface_flux','snowfall_surface_flux','surface_pressure', \
            'height_lowatmmodlay','temp_lowatmmodlay','specific_humidity_lowatmmodlay','windspeed_lowatmmodlay', \
            'vegetation_greenness_fraction','leaf_area_index','sm_rootzone_pctl','sm_profile_pctl', \
            'depth_to_water_table_from_surface_in_peat','free_surface_water_on_peat_flux','mwrtm_vegopacity']

#Name of output GeoTiff
out_tif = '/Users/ktabor/Documents/SMAP/GEE/SMAP_L4_SM_gph_20221120T013000_Vv7030_001.tif'

##############
def convert_EASEv2HDF5_GeoTiff(source_h5, var_list, target_tif):

    # Options for gdal_translate
    translate_options = gdal.TranslateOptions(
        format           = 'GTiff', 
        outputSRS        = '+proj=cea +lon_0=0 +lat_ts=30 +ellps=WGS84 +units=m',    
        outputBounds     =[-17367530.45, 7314540.11, 17367530.45, -7314540.11],	 
        noData           = -9999 
    )
    
    #array_to_raster params
    gt = EASE2_GRID_PARAMS['M09']['geotransform']
    wkt = EPSG[6933]
    
    #initiate temp tiff list
    tif_list =[]


    # convert individual variables to separate GeoTiff files
    sizeoflist=len(var_list)
    for iband in range(0,sizeoflist):
         var = var_list[iband]
         print(var)
         sds = gdal.Open('HDF5:'+source_h5+'://Geophysical_Data/'+var)
         sds_array = sds.ReadAsArray()
         dst_tmp = 'tmp'+str(iband+1)+'.tif'
         sds_gdal = array_to_raster(sds_array,gt,wkt)
         ds = gdal.Translate(dst_tmp,sds_gdal,options=translate_options)
         ds = None
         tif_list.append(dst_tmp)


    ############
    # build a VRT(Virtual Dataset) that includes the list of input tif files
    print(tif_list)
    gdal.BuildVRT('tmp.vrt',tif_list,options="-separate")

    warp_options = gdal.WarpOptions(
        creationOptions  = ["COMPRESS=LZW"],    
        srcSRS           = 'EPSG:6933',
        dstSRS           = 'EPSG:4326',
        srcNodata        = -9999,
        dstNodata        = -9999
     )

    # run gdal_Warp to reproject the VRT data and save in the target tif file with
    # compression
    ds = gdal.Warp(target_tif,'tmp.vrt', options=warp_options)
    ds = None 

    # remove temporary files
    os.remove('tmp.vrt')
    for f in tif_list:
        os.remove(f)

### CALL TO FUNCTION HERE

convert_EASEv2HDF5_GeoTiff(in_hdf, var_list, out_tif)

#change bandnames
#import ipdb
#ipdb.set_trace()
ds = gdal.Open(out_tif, gdal.GA_Update)
sizeoflist=len(var_list)
for band in range (0,sizeoflist):
    rb = ds.GetRasterBand(band+1)
    rb.SetDescription(var_list[band])
rb = None
ds = None

