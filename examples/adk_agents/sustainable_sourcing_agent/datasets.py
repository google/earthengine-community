"""21 April 2026 Copied from:

https://github.com/forestdatapartnership/whisp/blob/main/src/openforis_whisp/datasets.py
"""

from datetime import datetime
import inspect
import logging
import ee

# Defining here instead of importing from config_runtime,
# to allow functioning as more of a standalone script.
geometry_area_column = "Area"

# Calculate current year once at module load time (not in functions)
# This avoids repeated datetime calls and potential .getInfo() calls.
CURRENT_YEAR = datetime.now().year
CURRENT_YEAR_2DIGIT = CURRENT_YEAR % 100  # Last two digits for RADD datasets

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


def get_logger(name):
  return logging.getLogger(name)


# tree cover datasets


# ESA_TC_2020
def g_esa_worldcover_trees_prep():
  esa_worldcover_2020_raw = ee.Image("ESA/WorldCover/v100/2020")
  esa_worldcover_trees_2020 = esa_worldcover_2020_raw.eq(95).Or(
      esa_worldcover_2020_raw.eq(10)
  )  # get trees and mnangroves
  return esa_worldcover_trees_2020.rename("ESA_TC_2020").selfMask()


# EUFO_2020
def g_jrc_gfc_2020_prep():
  # JRC GFC2020 V3 is a single Image with band 'Map'
  jrc_gfc2020 = ee.Image("JRC/GFC2020/V3").select("Map")
  return jrc_gfc2020.rename("EUFO_2020").selfMask()


# GFC_TC_2020
def g_glad_gfc_10pc_prep():
  gfc = ee.Image("UMD/hansen/global_forest_change_2024_v1_12")
  gfc_treecover2000 = gfc.select(["treecover2000"])
  gfc_loss2001_2020 = gfc.select(["lossyear"]).lte(20)
  gfc_treecover2020 = gfc_treecover2000.where(gfc_loss2001_2020.eq(1), 0)
  return gfc_treecover2020.gt(10).rename("GFC_TC_2020").selfMask()


# GLAD_Primary
def g_glad_pht_prep():
  primary_ht_forests2001_raw = ee.ImageCollection(
      "UMD/GLAD/PRIMARY_HUMID_TROPICAL_FORESTS/v1"
  )
  primary_ht_forests2001 = (
      primary_ht_forests2001_raw.select("Primary_HT_forests")
      .mosaic()
      .selfMask()
  )
  gfc = ee.Image("UMD/hansen/global_forest_change_2024_v1_12")
  gfc_loss2001_2020 = gfc.select(["lossyear"]).lte(20)
  return (
      primary_ht_forests2001.where(gfc_loss2001_2020.eq(1), 0)
      .rename("GLAD_Primary")
      .selfMask()
  )


# TMF_undist (undistrubed forest in 2020)
def g_jrc_tmf_undisturbed_prep():
  TMF_undist_2020 = (
      ee.ImageCollection("projects/JRC/TMF/v1_2025/AnnualChanges")
      .select("Dec2020")
      .mosaic()
      .eq(1)
  )  # update from https://github.com/forestdatapartnership/whisp/issues/42
  return TMF_undist_2020.rename("TMF_undist").selfMask()


# Forest Persistence FDaP
def g_fdap_forest_prep():
  fdap_forest_raw = ee.Image(
      "projects/forestdatapartnership/assets/community_forests/ForestPersistence_2020"
  )
  fdap_forest = fdap_forest_raw.gt(0.75)
  return fdap_forest.rename("Forest_FDaP").selfMask()


#########################primary forest
# EUFO JRC Global forest type - primary
def g_gft_primary_prep():
  gft_raw = ee.Image("JRC/GFC2020_subtypes/V1")
  gft_primary = gft_raw.eq(10)
  return gft_primary.rename("GFT_primary").selfMask()


# Intact Forest Landscape 2020
def g_ifl_2020_prep():
  IFL_2020 = ee.Image("users/potapovpeter/IFL_2020")
  return IFL_2020.rename("IFL_2020").selfMask()


# European Primary Forest Dataset
def g_epfd_prep():
  EPFD = ee.FeatureCollection("HU_BERLIN/EPFD/V2/polygons")
  EPFD_binary = ee.Image().paint(EPFD, 1)
  return EPFD_binary.rename("European_Primary_Forest").selfMask()


# EUFO JRC Global forest type - naturally regenerating planted/plantation forests
def g_gft_nat_reg_prep():
  gft_raw = ee.Image("JRC/GFC2020_subtypes/V1")
  gft_nat_reg = gft_raw.eq(1)
  return gft_nat_reg.rename("GFT_naturally_regenerating").selfMask()


#########################planted and plantation forests


# EUFO JRC Global forest type - planted/plantation forests
def g_gft_plantation_prep():
  gft_raw = ee.Image("JRC/GFC2020_subtypes/V1")
  gft_plantation = gft_raw.eq(20)
  return gft_plantation.rename("GFT_planted_plantation").selfMask()


def g_iiasa_planted_prep():
  iiasa = ee.Image("projects/sat-io/open-datasets/GFM/FML_v3-2")
  iiasa_PL = iiasa.eq(31).Or(iiasa.eq(32))
  return iiasa_PL.rename("IIASA_planted_plantation").selfMask()


#########################TMF regrowth in 2023
def g_tmf_regrowth_prep():
  # Load the TMF Degradation annual product
  TMF_AC = ee.ImageCollection("projects/JRC/TMF/v1_2025/AnnualChanges").mosaic()
  TMF_AC_2023 = TMF_AC.select("Dec2023")
  Regrowth_TMF = TMF_AC_2023.eq(4)
  return Regrowth_TMF.rename("TMF_regrowth_2023").selfMask()


############tree crops


# TMF_plant (plantations in 2020)
def g_jrc_tmf_plantation_prep():
  transition = ee.ImageCollection(
      "projects/JRC/TMF/v1_2025/TransitionMap_Subtypes"
  ).mosaic()
  deforestation_year = ee.ImageCollection(
      "projects/JRC/TMF/v1_2025/DeforestationYear"
  ).mosaic()
  plantation = (transition.gte(81)).And(transition.lte(86))
  plantation_2020 = plantation.where(
      deforestation_year.gte(2021), 0
  )  # update from https://github.com/forestdatapartnership/whisp/issues/42
  return plantation_2020.rename("TMF_plant").selfMask()


# # Oil_palm_Descals
# NB updated to Descals et al 2024 paper (as opposed to Descals et al 2021 paper)
def g_creaf_descals_palm_prep():
  # Load the Global Oil Palm Year of Plantation image and mosaic it
  img = (
      ee.ImageCollection(
          "projects/ee-globaloilpalm/assets/shared/GlobalOilPalm_YoP_2021"
      )
      .mosaic()
      .select("minNBR_date")
  ).selfMask()

  # Calculate the year of plantation and select all below and including 2020
  oil_palm_plantation_year = img.divide(365).add(1970).floor().lte(2020)

  # Create a mask for plantations in the year 2020 or earlier
  plantation_2020 = oil_palm_plantation_year.lte(2020)
  return plantation_2020.rename("Oil_palm_Descals").selfMask()


# Cocoa_ETH
def g_eth_kalischek_cocoa_prep():
  return (
      ee.Image("projects/ee-nk-cocoa/assets/cocoa_map_threshold_065")
      .rename("Cocoa_ETH")
      .selfMask()
  )


# fdap datasets

# Thresholds and model info here https://github.com/google/forest-data-partnership/blob/main/models/README.md


# Oil Palm FDaP
def g_fdap_palm_prep():
  fdap_palm2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/palm/model_2025a"
  )
  fdap_palm = (
      fdap_palm2020_model_raw.filterDate("2020-01-01", "2020-12-31")
      .mosaic()
      .gt(0.88)  # Precision and recall ~78% at 0.88 threshold.
  )
  return fdap_palm.rename("Oil_palm_FDaP").selfMask()


def g_fdap_palm_2023_prep():
  fdap_palm2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/palm/model_2025a"
  )
  fdap_palm = (
      fdap_palm2020_model_raw.filterDate("2023-01-01", "2023-12-31")
      .mosaic()
      .gt(0.88)  # Precision and recall ~78% at 0.88 threshold.
  )
  return fdap_palm.rename("Oil_palm_2023_FDaP").selfMask()


# Cocoa FDaP
def g_fdap_cocoa_prep():
  fdap_cocoa2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/cocoa/model_2025a"
  )
  fdap_cocoa = (
      fdap_cocoa2020_model_raw.filterDate("2020-01-01", "2020-12-31")
      .mosaic()
      .gt(0.96)  # Precision and recall ~87% 0.96 threshold.
  )
  return fdap_cocoa.rename("Cocoa_FDaP").selfMask()


def g_fdap_cocoa_2023_prep():
  fdap_cocoa2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/cocoa/model_2025a"
  )
  fdap_cocoa = (
      fdap_cocoa2020_model_raw.filterDate("2023-01-01", "2023-12-31")
      .mosaic()
      .gt(0.96)  # Precision and recall ~87% 0.96 threshold.
  )
  return fdap_cocoa.rename("Cocoa_2023_FDaP").selfMask()


# Rubber FDaP
def g_fdap_rubber_prep():
  fdap_rubber2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/rubber/model_2025a"
  )
  fdap_rubber = (
      fdap_rubber2020_model_raw.filterDate("2020-01-01", "2020-12-31")
      .mosaic()
      .gt(0.59)  # Precision and recall ~80% 0.59 threshold.
  )
  return fdap_rubber.rename("Rubber_FDaP").selfMask()


def g_fdap_rubber_2023_prep():
  fdap_rubber2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/rubber/model_2025a"
  )
  fdap_rubber = (
      fdap_rubber2020_model_raw.filterDate("2023-01-01", "2023-12-31")
      .mosaic()
      .gt(0.59)  # Threshold for Rubber
  )
  return fdap_rubber.rename("Rubber_2023_FDaP").selfMask()


# # Coffee FDaP
def g_fdap_coffee_2020_prep():
  # Load the coffee model for 2020
  collection = ee.ImageCollection(
      "projects/forestdatapartnership/assets/coffee/model_2025a"
  )

  # Filter the collection for the year 2020 and create a binary mask
  coffee_2020 = (
      collection.filterDate("2020-01-01", "2020-12-31")
      .mosaic()
      .gt(0.99)  # Precision and recall ~54% 0.99 threshold.
  )

  return coffee_2020.rename("Coffee_FDaP").selfMask()


def g_fdap_coffee_2023_prep():
  # Load the coffee model for 2020
  collection = ee.ImageCollection(
      "projects/forestdatapartnership/assets/coffee/model_2025a"
  )

  # Filter the collection for the year 2023 and create a binary mask
  coffee_2023 = (
      collection.filterDate("2023-01-01", "2023-12-31")
      .mosaic()
      .gt(0.99)  # Precision and recall ~54% 0.99 threshold.
  )
  return coffee_2023.rename("Coffee_FDaP_2023").selfMask()


# Rubber_RBGE  - from Royal Botanical Gardens of Edinburgh (RBGE) NB for 2021
def g_rbge_rubber_prep():
  return (
      ee.Image(
          "users/wangyxtina/MapRubberPaper/rRubber10m202122_perc1585DifESAdist5pxPF"
      )
      .rename("Rubber_RBGE")
      .selfMask()
  )


# soy 2020 South America
def g_soy_song_2020_prep():
  return (
      ee.Image("projects/glad/soy_annual_SA/2020")
      .rename("Soy_Song_2020")
      .selfMask()
  )


##############
# ESRI 2023


# ESRI 2023 - Tree Cover
def g_esri_2023_tc_prep():
  esri_lulc10_raw = ee.ImageCollection(
      "projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS"
  )
  esri_lulc10_TC = (
      esri_lulc10_raw.filterDate("2023-01-01", "2023-12-31").mosaic().eq(2)
  )
  return esri_lulc10_TC.rename("ESRI_2023_TC").selfMask()


# ESRI 2023 - Crop
def g_esri_2020_2023_crop_prep():
  esri_lulc10_raw = ee.ImageCollection(
      "projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS"
  )
  esri_lulc10_crop_2020 = (
      esri_lulc10_raw.filterDate("2020-01-01", "2020-12-31").mosaic().eq(5)
  )
  esri_lulc10_crop_2023 = (
      esri_lulc10_raw.filterDate("2023-01-01", "2023-12-31").mosaic().eq(5)
  )

  newCrop = esri_lulc10_crop_2023.And(esri_lulc10_crop_2020.Not())

  return newCrop.rename("ESRI_crop_gain_2020_2023").selfMask()


#### disturbances by year


# RADD_year_2019 to RADD_year_< current year >
# Coverage: Primary humid tropical forest areas of South America, sub-Saharan Africa,
#           and insular Southeast Asia at 10m spatial resolution.
#           Available from January 2019 to present for Africa,
#           and from January 2020 to present for South America and Southeast Asia.
def g_radd_year_prep():
  """RADD alerts per year as multiband image.

  Each band is binary (1 = alert detected). Coverage: Primary humid tropical
  forest areas of South America, sub-Saharan Africa,

            and insular Southeast Asia at 10m spatial resolution.
            Available from January 2019 to present for Africa,
            and from January 2020 to present for South America and Southeast
            Asia.
  """
  radd = ee.ImageCollection("projects/radar-wur/raddalert/v1")
  radd_date = (
      radd.filterMetadata("layer", "contains", "alert").select("Date").mosaic()
  )
  start_year = 19
  current_year = CURRENT_YEAR_2DIGIT

  def make_band(year, img_stack):
    start = year * 1000
    end = year * 1000 + 365
    radd_year = (
        radd_date.updateMask(radd_date.gte(start))
        .updateMask(radd_date.lte(end))
        .gt(0)
        .rename("RADD_year_" + "20" + str(year))
        .selfMask()
    )
    return ee.Image(img_stack).addBands(radd_year)

  years = ee.List.sequence(start_year, current_year)
  first_year = ee.Number(years.get(0))
  start = first_year.multiply(1000)
  end = first_year.multiply(1000).add(365)
  band_name = ee.String("RADD_year_").cat("20").cat(first_year.format("%02d"))
  first_band = (
      radd_date.updateMask(radd_date.gte(start))
      .updateMask(radd_date.lte(end))
      .gt(0)
      .rename(band_name)
      .selfMask()
  )

  def make_band(year, img_stack):
    year_num = ee.Number(year)
    start = year_num.multiply(1000)
    end = year_num.multiply(1000).add(365)
    band_name = ee.String("RADD_year_").cat("20").cat(year_num.format("%02d"))
    radd_year = (
        radd_date.updateMask(radd_date.gte(start))
        .updateMask(radd_date.lte(end))
        .gt(0)
        .rename(band_name)
        .selfMask()
    )
    return ee.Image(img_stack).addBands(radd_year)

  img_stack = years.slice(1).iterate(make_band, first_band)
  return ee.Image(img_stack)


# TMF_def_2000 to TMF_def_2023
def g_tmf_def_per_year_prep():
  # Load the TMF Deforestation annual product
  tmf_def = ee.ImageCollection(
      "projects/JRC/TMF/v1_2025/DeforestationYear"
  ).mosaic()
  img_stack = None
  # Generate an image based on GFC with one band of forest tree loss per year from 2001 to 2022
  for i in range(0, 24 + 1):
    year_num = ee.Number(2000 + i)
    band_name = ee.String("TMF_def_").cat(year_num.format("%d"))
    tmf_def_year = tmf_def.eq(year_num).rename(band_name).selfMask()
    if img_stack is None:
      img_stack = tmf_def_year
    else:
      img_stack = img_stack.addBands(tmf_def_year)
  return img_stack


# TMF_deg_2000 to TMF_deg_2023
def g_tmf_deg_per_year_prep():
  # Load the TMF Degradation annual product
  tmf_def = ee.ImageCollection(
      "projects/JRC/TMF/v1_2025/DegradationYear"
  ).mosaic()
  img_stack = None
  # Generate an image based on GFC with one band of forest tree loss per year from 2001 to 2022
  for i in range(0, 24 + 1):
    year_num = ee.Number(2000 + i)
    band_name = ee.String("TMF_deg_").cat(year_num.format("%d"))
    tmf_def_year = tmf_def.eq(year_num).rename(band_name).selfMask()
    if img_stack is None:
      img_stack = tmf_def_year
    else:
      img_stack = img_stack.addBands(tmf_def_year)
  return img_stack


# GFC_loss_year_2001 to GFC_loss_year_2023 (correct for version 11)
def g_glad_gfc_loss_per_year_prep():
  # Load the Global Forest Change dataset
  gfc = ee.Image("UMD/hansen/global_forest_change_2024_v1_12")
  img_stack = None
  # Generate an image based on GFC with one band of forest tree loss per year from 2001 to 2022
  for i in range(1, 24 + 1):
    year_num = ee.Number(2000 + i)
    band_name = ee.String("GFC_loss_year_").cat(year_num.format("%d"))
    gfc_loss_year = (
        gfc.select(["lossyear"]).eq(i).And(gfc.select(["treecover2000"]).gt(10))
    )
    gfc_loss_year = gfc_loss_year.rename(band_name).selfMask()
    if img_stack is None:
      img_stack = gfc_loss_year
    else:
      img_stack = img_stack.addBands(gfc_loss_year)
  return img_stack


# MODIS_fire_2000 to MODIS_fire_< current year >
def g_modis_fire_prep():
  modis_fire = ee.ImageCollection("MODIS/061/MCD64A1")
  start_year = 2000

  # Determine the last available year by checking the latest image in the collection
  last_image = modis_fire.sort("system:time_start", False).first()
  last_date = ee.Date(last_image.get("system:time_start"))
  end_year = last_date.get("year").getInfo()

  img_stack = None

  for year in range(start_year, end_year + 1):
    year_num = ee.Number(year)
    band_name = ee.String("MODIS_fire_").cat(year_num.format("%d"))
    date_st = f"{year}-01-01"
    date_ed = f"{year}-12-31"
    modis_year = (
        modis_fire.filterDate(date_st, date_ed)
        .mosaic()
        .select(["BurnDate"])
        .gte(0)
        .rename(band_name)
        .selfMask()
    )
    img_stack = (
        modis_year if img_stack is None else img_stack.addBands(modis_year)
    )

  return img_stack


# ESA_fire_2000 to ESA_fire_2020
def g_esa_fire_prep():
  esa_fire = ee.ImageCollection("ESA/CCI/FireCCI/5_1")
  start_year = 2001

  # Determine the last available year by checking the latest image in the collection
  last_image = esa_fire.sort("system:time_start", False).first()
  last_date = ee.Date(last_image.get("system:time_start"))
  end_year = last_date.get("year").getInfo()

  img_stack = None

  for year in range(start_year, end_year + 1):
    year_num = ee.Number(year)
    band_name = ee.String("ESA_fire_").cat(year_num.format("%d"))
    date_st = f"{year}-01-01"
    date_ed = f"{year}-12-31"
    esa_year = (
        esa_fire.filterDate(date_st, date_ed)
        .mosaic()
        .select(["BurnDate"])
        .gte(0)
        .rename(band_name)
        .selfMask()
    )
    img_stack = esa_year if img_stack is None else img_stack.addBands(esa_year)

  return img_stack


#### disturbances combined (split into before and after 2020)


# RADD_after_2020
def g_radd_after_2020_prep():
  radd = ee.ImageCollection("projects/radar-wur/raddalert/v1")

  radd_date = (
      radd.filterMetadata("layer", "contains", "alert").select("Date").mosaic()
  )
  # date of availability
  # (starts 2019 in Africa, then 2020 for S America and Asia:
  # https://data.globalforestwatch.org/datasets/gfw::deforestation-alerts-radd/about)
  start_year = 21

  # Use pre-calculated current year (avoids repeated datetime calls)
  current_year = CURRENT_YEAR_2DIGIT
  start = start_year * 1000
  end = current_year * 1000 + 365
  return (
      radd_date.updateMask(radd_date.gte(start))
      .updateMask(radd_date.lte(end))
      .gt(0)
      .rename("RADD_after_2020")
  ).selfMask()


# RADD_before_2020
def g_radd_before_2020_prep():
  radd = ee.ImageCollection("projects/radar-wur/raddalert/v1")

  radd_date = (
      radd.filterMetadata("layer", "contains", "alert").select("Date").mosaic()
  )
  # date of availability
  start_year = 19  ## (starts 2019 in Africa, then 2020 for S America and Asia: https://data.globalforestwatch.org/datasets/gfw::deforestation-alerts-radd/about)

  start = start_year * 1000
  end = 20 * 1000 + 365
  return (
      radd_date.updateMask(radd_date.gte(start))
      .updateMask(radd_date.lte(end))
      .gt(0)
      .rename("RADD_before_2020")
  ).selfMask()


# DIST_after_2020

# DIST alerts are for all veg types so masked by EUFO forest 2020
# NB alerts only for 2024 onwards (in GEE at least, available for 2023 from the GLAD site)
# for conistency using "...after_2020..." terminology.
# def g_glad_dist_after_2020_prep():
#
#     # no need to filter by date as all dates are later than 2023
#
#     # Load the vegetation disturbance collections
#     VEGDISTSTATUS = ee.ImageCollection(
#         "projects/glad/HLSDIST/current/VEG-DIST-STATUS"
#     ).mosaic()
#
#     # Key for high-confidence alerts (values 3, 6, 7, 8)
#     high_conf_values = [3, 6, 7, 8]
#
#     # Create high-confidence mask
#     dist_high_conf = VEGDISTSTATUS.remap(
#         high_conf_values, [1] * len(high_conf_values), 0
#     )
#
#     return dist_high_conf.updateMask(g_jrc_gfc_2020_prep()).rename(
#         "DIST_after_2020"
#     )  # Mask alerts to forest and rename band


# # DIST_alert_2024 to DIST_alert_< current year >
# # Notes:
# # 1) so far only available for 2024 onwards in GEE
# # 2) masked alerts (as dist alerts are for all vegetation) to JRC EUFO 2020 layer, as close to EUDR definition


# def g_glad_dist_year_prep():
#     """
#     GLAD DIST alerts per year as multiband image.
#     Each band is binary (1 = high-confidence disturbance alert).
#     Uses VEG-DIST-DATE to filter by year, VEG-DIST-STATUS for confidence.
#     Masked to EUFO 2020 forest.
#     Note: Only available from 2024 onwards.
#     Fully server-side using ee.List.iterate (no Python for loop).
#     """
#     # Load the vegetation disturbance collections
#     #  Vegetation disturbance status (0-8, class flag, 8-bit)
#     VEGDISTSTATUS = ee.ImageCollection(
#         "projects/glad/HLSDIST/current/VEG-DIST-STATUS"
#     ).mosaic()
#     # Initial vegetation disturbance date (>0: days since 2020-12-31, 16-bit)
#     VEGDISTDATE = ee.ImageCollection(
#         "projects/glad/HLSDIST/current/VEG-DIST-DATE"
#     ).mosaic()
#
#     # Key for high-confidence alerts (values 3, 6, 7, 8)
#     # 3 = <50% loss, high confidence, ongoing
#     # 6 = ≥50% loss, high confidence, ongoing
#     # 7 = <50% loss, high confidence, finished
#     # 8 = ≥50% loss, high confidence, finished
#     high_conf_values = [3, 6, 7, 8]
#     dist_high_conf = VEGDISTSTATUS.remap(
#         high_conf_values, [1] * len(high_conf_values), 0
#     )
#
#     # Year range: 2024 to current year
#     start_year = 2024
#     end_year = CURRENT_YEAR
#
#     # Reference date for day offset calculation (2020-12-31)
#     ref_date = ee.Date("2020-12-31")
#
#     # Create first band (2024)
#     first_year = ee.Number(start_year)
#     first_start_days = ee.Date.fromYMD(first_year, 1, 1).difference(ref_date, "day")
#     first_end_days = ee.Date.fromYMD(first_year.add(1), 1, 1).difference(
#         ref_date, "day"
#     )
#     first_year_mask = VEGDISTDATE.gte(first_start_days).And(
#         VEGDISTDATE.lt(first_end_days)
#     )
#     first_band_name = ee.String("DIST_year_").cat(first_year.format("%d"))
#     first_band = (
#         first_year_mask.updateMask(dist_high_conf).rename(first_band_name).selfMask()
#     )
#
#     # Server-side iteration to add remaining years
#     years = ee.List.sequence(start_year + 1, end_year)
#
#     def add_year_band(year, img_stack):
#         year_num = ee.Number(year)
#         start_days = ee.Date.fromYMD(year_num, 1, 1).difference(ref_date, "day")
#         end_days = ee.Date.fromYMD(year_num.add(1), 1, 1).difference(ref_date, "day")
#         year_mask = VEGDISTDATE.gte(start_days).And(VEGDISTDATE.lt(end_days))
#         band_name = ee.String("DIST_year_").cat(year_num.format("%d"))
#         year_band = year_mask.updateMask(dist_high_conf).rename(band_name).selfMask()
#         return ee.Image(img_stack).addBands(year_band)
#
#     img_stack = ee.Image(years.iterate(add_year_band, first_band))
#
#     # Mask to EUFO 2020 forest
#     return img_stack.updateMask(g_jrc_gfc_2020_prep())


# GLAD-L (GLAD Landsat) Alerts
# Coverage: Entire tropics (30°N to 30°S) from January 1, 2018 to present,
#           and from 2015 to present for select countries in the Amazon, Congo Basin,
#           and insular Southeast Asia.
# Uses confidence bands per year where values >= 2 are confirmed alerts
# Asset paths per year:
#   2021: projects/glad/alert/2021final (conf21)
#   2022: projects/glad/alert/2022final (conf22)
#   2023: projects/glad/alert/2023final (conf23)
#   2024: NOT AVAILABLE
#   2025+: projects/glad/alert/UpdResult (conf25, conf26, etc.)
# More info: https://glad.umd.edu/dataset/glad-forest-alerts


# GLAD-L_after_2020 (combined alerts from 2021 to current year, excluding 2024)
def g_glad_l_after_2020_prep():
  """GLAD Landsat alerts after 2020 (combined from 2021 onwards).

  Uses confidence bands with threshold >= 2 for confirmed alerts. Note: 2024
  data is not available.
  """
  # Load yearly assets and combine into single multiband image
  glad_combined = (
      ee.ImageCollection("projects/glad/alert/2021final")
      .mosaic()
      .select("conf21")
      .addBands(
          ee.ImageCollection("projects/glad/alert/2022final")
          .mosaic()
          .select("conf22")
      )
      .addBands(
          ee.ImageCollection("projects/glad/alert/2023final")
          .mosaic()
          .select("conf23")
      )
      .addBands(
          ee.ImageCollection("projects/glad/alert/UpdResult")
          .mosaic()
          .select(["conf25", "conf26"])
      )
  )

  # Combine alerts from all available years (confidence >= 2)
  # 2024 not available
  combined_alerts = (
      glad_combined.select("conf21")
      .gte(2)
      .Or(glad_combined.select("conf22").gte(2))
      .Or(glad_combined.select("conf23").gte(2))
      .Or(glad_combined.select("conf25").gte(2))
      .Or(glad_combined.select("conf26").gte(2))
  )

  return combined_alerts.rename("GLAD-L_after_2020").selfMask()


# GLAD-L_before_2020 (combined alerts from 2017 to 2020)
def g_glad_l_before_2020_prep():
  """GLAD Landsat alerts before 2020 (combined from 2017-2020 inclusive).

  Uses confidence bands with threshold >= 2 for confirmed alerts. Note: 2015 and
  2016 assets are not available in GEE. Coverage: Tropics (30°N to 30°S).
  """
  # Load yearly assets and combine
  glad_combined = (
      ee.ImageCollection("projects/glad/alert/2017final")
      .mosaic()
      .select("conf17")
      .addBands(
          ee.ImageCollection("projects/glad/alert/2018final")
          .mosaic()
          .select("conf18")
      )
      .addBands(
          ee.ImageCollection("projects/glad/alert/2019final")
          .mosaic()
          .select("conf19")
      )
      .addBands(
          ee.ImageCollection("projects/glad/alert/2020final")
          .mosaic()
          .select("conf20")
      )
  )

  # Combine alerts from all available years (confidence >= 2)
  combined_alerts = (
      glad_combined.select("conf17")
      .gte(2)
      .Or(glad_combined.select("conf18").gte(2))
      .Or(glad_combined.select("conf19").gte(2))
      .Or(glad_combined.select("conf20").gte(2))
  )

  return combined_alerts.rename("GLAD-L_before_2020").selfMask()


# GLAD-L timeseries - multiband image with one band per year
def g_glad_l_year_prep():
  """GLAD Landsat alerts per year as multiband image.

  Each band is binary (1 = alert with confidence >= 2). Coverage: Entire tropics
  (30°N to 30°S) from January 1, 2018 to present,

            and from 2017 to present for select countries in the Amazon,
            Congo Basin, and insular Southeast Asia.
  Note: 2015 and 2016 assets are not available in GEE.
  Note: 2024 data is not available.
  Includes years from 2017 onwards.
  """
  # Build multiband image with all available years
  # Years 2017-2023 use YYYYfinal assets, 2025+ use UpdResult
  # Note: 2015final and 2016final assets do not exist in GEE
  img_stack = (
      # 2017
      ee.ImageCollection("projects/glad/alert/2017final")
      .mosaic()
      .select("conf17")
      .gte(2)
      .rename("GLAD-L_year_2017")
      .selfMask()
      # 2018
      .addBands(
          ee.ImageCollection("projects/glad/alert/2018final")
          .mosaic()
          .select("conf18")
          .gte(2)
          .rename("GLAD-L_year_2018")
          .selfMask()
      )
      # 2019
      .addBands(
          ee.ImageCollection("projects/glad/alert/2019final")
          .mosaic()
          .select("conf19")
          .gte(2)
          .rename("GLAD-L_year_2019")
          .selfMask()
      )
      # 2020
      .addBands(
          ee.ImageCollection("projects/glad/alert/2020final")
          .mosaic()
          .select("conf20")
          .gte(2)
          .rename("GLAD-L_year_2020")
          .selfMask()
      )
      # 2021
      .addBands(
          ee.ImageCollection("projects/glad/alert/2021final")
          .mosaic()
          .select("conf21")
          .gte(2)
          .rename("GLAD-L_year_2021")
          .selfMask()
      )
      # 2022
      .addBands(
          ee.ImageCollection("projects/glad/alert/2022final")
          .mosaic()
          .select("conf22")
          .gte(2)
          .rename("GLAD-L_year_2022")
          .selfMask()
      )
      # 2023
      .addBands(
          ee.ImageCollection("projects/glad/alert/2023final")
          .mosaic()
          .select("conf23")
          .gte(2)
          .rename("GLAD-L_year_2023")
          .selfMask()
      )
      # 2024 NOT AVAILABLE
      # 2025
      .addBands(
          ee.ImageCollection("projects/glad/alert/UpdResult")
          .mosaic()
          .select("conf25")
          .gte(2)
          .rename("GLAD-L_year_2025")
          .selfMask()
      )
      # 2026
      .addBands(
          ee.ImageCollection("projects/glad/alert/UpdResult")
          .mosaic()
          .select("conf26")
          .gte(2)
          .rename("GLAD-L_year_2026")
          .selfMask()
      )
  )

  return img_stack


# GLAD-S2 (GLAD Sentinel-2) Alerts
# GLAD-S2_after_2020 (combined alerts from 2021 to current year)
def g_glad_s2_after_2020_prep():
  """GLAD Sentinel-2 alerts after 2020 (filtered and combined from 2021 onwards - original data starts 2019).

  Uses alert band with threshold >= 2 for confirmed alerts. Coverage: Primary
  humid tropical forest within Amazon basin region.
  https://glad.umd.edu/dataset/glad-forest-alerts
  """
  col = "projects/glad/S2alert"
  s2alert = ee.Image(col + "/alert")
  alert_date = ee.Image(col + "/alertDate")

  # Date encoding: days since 2019-01-01
  # 2020-12-31 = 730 days (end of 2020)
  days_end_2020 = 730

  # Filter alerts after 2020 with confidence >= 2
  #   - alert: confidence band (0-4, where 4 is highest confidence)
  alerts_after_2020 = s2alert.gte(2).And(alert_date.gt(days_end_2020))

  return alerts_after_2020.rename("GLAD-S2_after_2020").selfMask()


# GLAD-S2_before_2020 (combined alerts from 2019 to 2020)
def g_glad_s2_before_2020_prep():
  """GLAD Sentinel-2 alerts before 2020 (from 2019-01-01 to 2020-12-31 inclusive).

  Uses alert band with threshold >= 2 for confirmed alerts. Coverage: Primary
  humid tropical forest within Amazon basin region. Note: Data starts from 2019.
  """
  col = "projects/glad/S2alert"
  s2alert = ee.Image(col + "/alert")
  alert_date = ee.Image(col + "/alertDate")

  # Date encoding: days since 2019-01-01
  # 2019-01-01 = 0, 2020-12-31 = 730 days
  days_end_2020 = 730

  # Filter alerts up to end of 2020 with confidence >= 2
  alerts_before_2020 = s2alert.gte(2).And(alert_date.lte(days_end_2020))

  return alerts_before_2020.rename("GLAD-S2_before_2020").selfMask()


# GLAD-S2 timeseries - multiband image with one band per year
def g_glad_s2_year_prep():
  """GLAD Sentinel-2 alerts per year as multiband image.

  Each band is binary (1 = alert with confidence >= 2). Coverage: Primary humid
  tropical forest areas of South America

            from January 2019 to present.
  Date encoding: days since 2019-01-01.
  Includes years from 2019 onwards.
  """
  col = "projects/glad/S2alert"
  s2alert = ee.Image(col + "/alert")
  alert_date = ee.Image(col + "/alertDate")

  # Confidence threshold for confirmed alerts
  confirmed = s2alert.gte(2)

  # Date encoding: days since 2019-01-01
  # Year boundaries (days since 2019-01-01):
  # 2019-01-01 = 0, 2020-01-01 = 365, 2021-01-01 = 731, 2022-01-01 = 1096
  # 2023-01-01 = 1461, 2024-01-01 = 1827, 2025-01-01 = 2192, 2026-01-01 = 2557
  ref_date = ee.Date("2019-01-01")

  # Build multiband image with available years (data starts 2019)
  start_year = 2019
  end_year = CURRENT_YEAR

  # Create first band (2019)
  first_year = ee.Number(start_year)
  first_start_days = ee.Date.fromYMD(first_year, 1, 1).difference(
      ref_date, "day"
  )
  first_end_days = ee.Date.fromYMD(first_year.add(1), 1, 1).difference(
      ref_date, "day"
  )
  first_year_mask = alert_date.gte(first_start_days).And(
      alert_date.lt(first_end_days)
  )
  first_band_name = ee.String("GLAD-S2_year_").cat(first_year.format("%d"))
  first_band = (
      confirmed.updateMask(first_year_mask).rename(first_band_name).selfMask()
  )

  # Server-side iteration to add remaining years
  years = ee.List.sequence(start_year + 1, end_year)

  def add_year_band(year, img_stack):
    year_num = ee.Number(year)
    start_days = ee.Date.fromYMD(year_num, 1, 1).difference(ref_date, "day")
    end_days = ee.Date.fromYMD(year_num.add(1), 1, 1).difference(
        ref_date, "day"
    )
    year_mask = alert_date.gte(start_days).And(alert_date.lt(end_days))
    band_name = ee.String("GLAD-S2_year_").cat(year_num.format("%d"))
    year_band = confirmed.updateMask(year_mask).rename(band_name).selfMask()
    return ee.Image(img_stack).addBands(year_band)

  img_stack = ee.Image(years.iterate(add_year_band, first_band))

  return img_stack


#### disturbances combined (split into before and after 2020)


# TMF_deg_before_2020
def g_tmf_deg_before_2020_prep():
  tmf_deg = ee.ImageCollection(
      "projects/JRC/TMF/v1_2025/DegradationYear"
  ).mosaic()
  return (
      (tmf_deg.lte(2020))
      .And(tmf_deg.gte(2000))
      .rename("TMF_deg_before_2020")
      .selfMask()
  )


# TMF_deg_after_2020
def g_tmf_deg_after_2020_prep():
  tmf_deg = ee.ImageCollection(
      "projects/JRC/TMF/v1_2025/DegradationYear"
  ).mosaic()
  return tmf_deg.gt(2020).rename("TMF_deg_after_2020").selfMask()


# tmf_def_before_2020
def g_tmf_def_before_2020_prep():
  tmf_def = ee.ImageCollection(
      "projects/JRC/TMF/v1_2025/DeforestationYear"
  ).mosaic()
  return (
      (tmf_def.lte(2020))
      .And(tmf_def.gte(2000))
      .rename("TMF_def_before_2020")
      .selfMask()
  )


# tmf_def_after_2020
def g_tmf_def_after_2020_prep():
  tmf_def = ee.ImageCollection(
      "projects/JRC/TMF/v1_2025/DeforestationYear"
  ).mosaic()
  return tmf_def.gt(2020).rename("TMF_def_after_2020").selfMask()


# GFC_loss_before_2020 (loss within 10 percent cover; includes 2020; correct for version 11)
def g_glad_gfc_loss_before_2020_prep():
  # Load the Global Forest Change dataset
  gfc = ee.Image("UMD/hansen/global_forest_change_2024_v1_12")
  gfc_loss = (
      gfc.select(["lossyear"]).lte(20).And(gfc.select(["treecover2000"]).gt(10))
  )
  return gfc_loss.rename("GFC_loss_before_2020").selfMask()


# GFC_loss_after_2020 (loss within 10 percent cover; correct for version 11)
def g_glad_gfc_loss_after_2020_prep():
  # Load the Global Forest Change dataset
  gfc = ee.Image("UMD/hansen/global_forest_change_2024_v1_12")
  gfc_loss = (
      gfc.select(["lossyear"]).gt(20).And(gfc.select(["treecover2000"]).gt(10))
  )
  return gfc_loss.rename("GFC_loss_after_2020").selfMask()


# MODIS_fire_before_2020
def g_modis_fire_before_2020_prep():
  modis_fire = ee.ImageCollection("MODIS/061/MCD64A1")
  start_year = 2000
  end_year = 2020
  date_st = str(start_year) + "-01-01"
  date_ed = str(end_year) + "-12-31"
  return (
      modis_fire.filterDate(date_st, date_ed)
      .mosaic()
      .select(["BurnDate"])
      .gte(0)
      .rename("MODIS_fire_before_2020")
  ).selfMask()


# MODIS_fire_after_2020
def g_modis_fire_after_2020_prep():
  modis_fire = ee.ImageCollection("MODIS/061/MCD64A1")
  start_year = 2021
  # Use pre-calculated current year (avoids repeated datetime calls)
  end_year = CURRENT_YEAR - 1  # Use year - 1 to ensure data availability
  date_st = str(start_year) + "-01-01"
  date_ed = str(end_year) + "-12-31"
  return (
      modis_fire.filterDate(date_st, date_ed)
      .mosaic()
      .select(["BurnDate"])
      .gte(0)
      .rename("MODIS_fire_after_2020")
  ).selfMask()


# ESA_fire_before_2020
def g_esa_fire_before_2020_prep():
  esa_fire = ee.ImageCollection("ESA/CCI/FireCCI/5_1")
  start_year = 2000
  end_year = 2020
  date_st = str(start_year) + "-01-01"
  date_ed = str(end_year) + "-12-31"
  return (
      esa_fire.filterDate(date_st, date_ed)
      .mosaic()
      .select(["BurnDate"])
      .gte(0)
      .rename("ESA_fire_before_2020")
  ).selfMask()


#########################logging concessions
# http://data.globalforestwatch.org/datasets?q=logging&sort_by=relevance
def g_logging_concessions_before_2020_prep():
  RCA = ee.FeatureCollection(
      "projects/ee-whisp/assets/logging/RCA_Permis_dExploitation_et_dAmenagement"
  )
  RCA_binary = ee.Image().paint(RCA, 1)
  CMR = ee.FeatureCollection(
      "projects/ee-whisp/assets/logging/Cameroon_Forest_Management_Units"
  )
  CMR_binary = ee.Image().paint(CMR, 1)
  Eq_G = ee.FeatureCollection(
      "projects/ee-whisp/assets/logging/Equatorial_Guinea_logging_concessions"
  )
  Eq_G_binary = ee.Image().paint(Eq_G, 1)
  DRC = ee.FeatureCollection(
      "projects/ee-whisp/assets/logging/DRC_Forest_concession_agreements"
  )
  DRC_binary = ee.Image().paint(DRC, 1)
  Liberia = ee.FeatureCollection(
      "projects/ee-whisp/assets/logging/Liberia_Forest_Management_Contracts"
  )
  Liberia_binary = ee.Image().paint(Liberia, 1)
  RoC = ee.FeatureCollection(
      "projects/ee-whisp/assets/logging/Republic_of_the_Congo_logging_concessions"
  )
  Roc_binary = ee.Image().paint(RoC, 1)
  Sarawak = ee.FeatureCollection(
      "projects/ee-whisp/assets/logging/Sarawak_logging_concessions"
  )
  Sarawak_binary = ee.Image().paint(Sarawak, 1)
  logging_concessions_binary = ee.ImageCollection([
      RCA_binary,
      CMR_binary,
      Eq_G_binary,
      DRC_binary,
      Liberia_binary,
      Roc_binary,
      Sarawak_binary,
  ]).mosaic()

  return logging_concessions_binary.rename("GFW_logging_before_2020").selfMask()


#########################national datasets

# nBR Brazil

# ### nBR Natural forests in 2020:

# %%
# [Official NFMS dataset] INPE/EMBRAPA TerraClass land use/cover in the Amazon biome, 2020
# Subsetting criteria: primary forests (DN=1) and secondary forests (DN=2) // secondary forests are those recovering from deforestation
# the resulting dataset shows primary and secondary forest cover in 2020 (mostly by August 2020)


##########################primary forests###############################################
def nbr_terraclass_amz20_primary_prep():
  tcamz20 = ee.Image("projects/ee-whisp/assets/NBR/terraclass_amz_2020")
  tcamz20_f = tcamz20.eq(1)
  return tcamz20_f.rename("nBR_INPE_TC_primary_forest_Amazon_2020").selfMask()


# [Official NFMS dataset] Brazilian Forest Service dataset on natural forest cover from PRODES and TerraClass data, base year 2022
# Subsetting criteria: ano_desmat > 2020 and nom_class = 'Floresta'
# the resulting datasets show primary forest cover in 2020 for the Pantanal, Caatinga, Atlantic Forest and Pampa biomes.
# the resulting dataset shows primary and secondary forest cover in 2020 for the Cerrado biome (TerraClass 2020)
# For the Amazon, best to use Terraclass 2020 directly, because the BFS used TerraClass 2014.


# Pantanal
def nbr_bfs_ptn_f20_prep():
  bfs_fptn20 = ee.FeatureCollection("projects/ee-whisp/assets/NBR/bfs_ptn_2020")

  bfs_fptn20_binary = ee.Image().paint(bfs_fptn20, 1)
  return bfs_fptn20_binary.rename(
      "nBR_BFS_primary_forest_Pantanal_2020"
  ).selfMask()


# Caatinga - filtered with QGIS because the original geodatabase is too large to export as a shapefile (GEE accepted format)
## couldn't convert it to asset, working on it (Error: Primary geometry of feature '306862' has 2454627 vertices, above the limit of 1000000 vertices. (Error code: 3)
def nbr_bfs_caat_f20_prep():
  bfs_fcaat20 = ee.FeatureCollection(
      "projects/ee-whisp/assets/NBR/bfs_caat_2020"
  )
  bfs_fcaat20_binary = ee.Image().paint(bfs_fcaat20, 1)
  return bfs_fcaat20_binary.rename(
      "nBR_BFS_primary_forest_Caatinga_2020"
  ).selfMask()


# Atlantic Forest - filtered with QGIS because the original geodatabase is too large to export as a shapefile (GEE accepted format)
def nbr_bfs_atlf_f20_prep():
  bfs_fatlf20 = ee.FeatureCollection(
      "projects/ee-whisp/assets/NBR/bfs_atlf_2020"
  )
  bfs_fatlf20_binary = ee.Image().paint(bfs_fatlf20, 1)
  return bfs_fatlf20_binary.rename(
      "nBR_BFS_primary_forest_AtlanticForest_2020"
  ).selfMask()


# Pampa - filtered in QGIS to save some storage space
def nbr_bfs_pmp_f20_prep():
  bfs_fpmp20 = ee.FeatureCollection("projects/ee-whisp/assets/NBR/bfs_pmp_2020")
  bfs_fpmp20_binary = ee.Image().paint(bfs_fpmp20, 1)
  return bfs_fpmp20_binary.rename(
      "nBR_BFS_primary_forest_Pampa_2020"
  ).selfMask()


##########################secondary forests###############################################
def nbr_terraclass_amz20_secondary_prep():
  tcamz20 = ee.Image("projects/ee-whisp/assets/NBR/terraclass_amz_2020")
  tcamz20_f = tcamz20.eq(2)
  return tcamz20_f.rename("nBR_INPE_TC_secondary_forest_Amazon_2020").selfMask()


# Cerrado - filtered with QGIS because the original geodatabase is too large to export as a shapefile (GEE accepted format)
def nbr_bfs_cer_f20_prep():
  bfs_fcer20 = ee.FeatureCollection(
      "projects/ee-whisp/assets/NBR/bfs_cerr_2020"
  )
  bfs_fcer20_binary = ee.Image().paint(bfs_fcer20, 1)
  return bfs_fcer20_binary.rename(
      "nBR_BFS_primary_and_secondary_forest_Cerrado_2020"
  ).selfMask()


# %%
# [non-official dataset by MapBiomas multisector initiative]
# land use/cover from 1985 up to 2023, collection 9
# Subsetting criteria: classification_2020 = Forest formation (DN=3), Savanna Formation (DN=4, forest according to BR definition), Mangrove (DN=5), Floodable Forest (DN=6), Wooded Sandbank veg (DN=49)
# the resulting dataset shows forest cover in 2020, without distinguishing between primary and secondary forests
def nbr_mapbiomasc9_f20_prep():
  mapbiomasc9_20 = ee.Image(
      "projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1"
  ).select("classification_2020")
  mapbiomasc9_20_forest = (
      mapbiomasc9_20.eq(3)
      .Or(mapbiomasc9_20.eq(4))
      .Or(mapbiomasc9_20.eq(5))
      .Or(mapbiomasc9_20.eq(6))
      .Or(mapbiomasc9_20.eq(49))
  )
  return mapbiomasc9_20_forest.rename(
      "nBR_MapBiomas_col9_forest_Brazil_2020"
  ).selfMask()


# ### ########################NBR plantation forest in 2020:#######################################


# [Official NFMS dataset] INPE/EMBRAPA TerraClass land use/cover in the Amazon biome, 2020
# Subsetting criteria: silviculture (DN=9)
# the resulting dataset shows monospecific commercial plantations, mostly eucalyptus and pinus.
def nbr_terraclass_amz20_silv_prep():
  tcamz20 = ee.Image("projects/ee-whisp/assets/NBR/terraclass_amz_2020")
  tcamz20_silviculture = tcamz20.eq(9)
  return tcamz20_silviculture.rename(
      "nBR_INPE_TCsilviculture_Amazon_2020"
  ).selfMask()


# [Official NFMS dataset] INPE/EMBRAPA TerraClass land use/cover in the Cerrado biome, 2020
# Subsetting criteria: silviculture (DN=9)
# the resulting dataset shows monospecific commercial plantations, mostly eucalyptus and pinus.
def nbr_terraclass_silv_cer20_prep():
  tccer20 = ee.Image("projects/ee-whisp/assets/NBR/terraclass_cer_2020")
  tccer20_silviculture = tccer20.eq(9)
  return tccer20_silviculture.rename(
      "nBR_INPE_TCsilviculture_Cerrado_2020"
  ).selfMask()


# [non-official dataset by MapBiomas multisector initiative]
# land use/cover from 1985 up to 2023, collection 9
# Subsetting criteria: 'classification_2020' = Forest plantation (DN=9)
# the resulting dataset shows forest plantation in 2020
def nbr_mapbiomasc9_silv20_prep():
  mapbiomasc9_20 = ee.Image(
      "projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1"
  ).select("classification_2020")
  mapbiomasc9_20_silviculture = mapbiomasc9_20.eq(9)
  return mapbiomasc9_20_silviculture.rename(
      "nBR_MapBiomas_col9_silviculture_Brazil_2020"
  ).selfMask()


################ ### NBR Disturbances before 2020:########################################

# [Official NFMS dataset] INPE PRODES data up to 2023
# Subsetting criteria: DN = [0, 2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];


# the resulting dataset shows deforestation and conversion of OWL and OL up to 2020 (mostly August 2020), including residues (omission errors corrections)
def nbr_prodes_before_2020_prep():
  prodes = ee.Image("projects/ee-whisp/assets/NBR/prodes_brasil_2023")
  prodes_before_20_dn = [
      0,
      2,
      4,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      50,
      51,
      52,
      53,
      54,
      55,
      56,
      57,
      58,
      59,
      60,
  ]
  prodes_before_20_mask = prodes.remap(
      prodes_before_20_dn, [1] * len(prodes_before_20_dn)
  )  # .eq(1)
  return prodes_before_20_mask.rename(
      "nBR_PRODES_deforestation_Brazil_before_2020"
  ).selfMask()


## Caution: 1) includes deforestation and conversion of other wooded land and grassland

# [Official NFMS dataset] INPE.DETER data from 2nd August 2016 up to the 04th of April 2025
# Subsetting criteria: forest degradation classes ['CICATRIZ_DE_QUEIMADA', 'CS_DESORDENADO', 'DEGRADACAO'] and view_date until 2020-12-31
# 'CS_GEOMETRICO' excluded to align with FREL


def nbr_deter_amazon_before_2020_prep():
  deteramz = ee.FeatureCollection(
      "projects/ee-whisp/assets/NBR/deter_amz_16apr2025"
  )
  degradation_classes = ["CICATRIZ_DE_QUEIMADA", "CS_DESORDENADO", "DEGRADACAO"]

  # Add a formatted date field based on VIEW_DATE
  def add_formatted_date(feature):
    return feature.set("formatted_date", ee.Date(feature.get("VIEW_DATE")))

  deteramz = deteramz.map(add_formatted_date)

  deter_deg = deteramz.filter(
      ee.Filter.inList("CLASSNAME", degradation_classes)
  ).filter(ee.Filter.lt("formatted_date", ee.Date("2020-12-31")))

  deter_deg_binary = ee.Image().paint(deter_deg, 1)
  return deter_deg_binary.rename(
      "nBR_DETER_forestdegradation_Amazon_before_2020"
  ).selfMask()


################ ### NBR Disturbances after 2020:########################################
# [Official NFMS dataset] INPE PRODES data up to 2023
# Subsetting criteria: DN = [21, 22, 23, 61, 62, 63];

# the resulting dataset shows deforestation and conversion of OWL and OL up to 2020 (mostly August 2020), including residues (omission errors corrections)


def nbr_prodes_after_2020_prep():
  prodes = ee.Image("projects/ee-whisp/assets/NBR/prodes_brasil_2023")
  prodes_after_20_dn = [21, 22, 23, 61, 62, 63]
  prodes_after_20_mask = prodes.remap(
      prodes_after_20_dn, [1] * len(prodes_after_20_dn)
  )  # .eq(1)
  prodes_after_20 = prodes_after_20_mask.selfMask()
  return prodes_after_20.rename(
      "nBR_PRODES_deforestation_Brazil_after_2020"
  ).selfMask()


# %%
# [Official NFMS dataset] INPE.DETER data from 2nd August 2016 up to the 04th of April 2025
# Subsetting criteria: forest degradation classes ['CICATRIZ_DE_QUEIMADA', 'CS_DESORDENADO', 'DEGRADACAO'] and view_date from 2021-01-01 onward
# 'CS_GEOMETRICO' excluded to align with FREL
def nbr_deter_amazon_after_2020_prep():
  deteramz = ee.FeatureCollection(
      "projects/ee-whisp/assets/NBR/deter_amz_16apr2025"
  )
  degradation_classes = ["CICATRIZ_DE_QUEIMADA", "CS_DESORDENADO", "DEGRADACAO"]

  # Add a formatted date field based on VIEW_DATE
  def add_formatted_date(feature):
    return feature.set("formatted_date", ee.Date(feature.get("VIEW_DATE")))

  deteramz = deteramz.map(add_formatted_date)

  deter_deg = deteramz.filter(
      ee.Filter.inList("CLASSNAME", degradation_classes)
  ).filter(ee.Filter.gt("formatted_date", ee.Date("2021-01-01")))

  deter_deg_binary = ee.Image().paint(deter_deg, 1)
  return deter_deg_binary.rename(
      "nBR_DETER_forestdegradation_Amazon_after_2020"
  ).selfMask()


# ########################## NBR commodities - permanent/perennial crops in 2020:###############################
# [Official NFMS dataset] INPE/EMBRAPA TerraClass land use/cover in the Amazon biome, 2020
# OR [Official NFMS dataset] INPE/EMBRAPA TerraClass land use/cover in the Cerrado biome, 2020
# Subsetting criteria: perennial (DN=12) and semi-perennial (DN=13) crops
# the resulting dataset shows perennial and semi-perennial crops in 2020
def nbr_terraclass_amz_cer20_pc_prep():
  tcamz20 = ee.Image("projects/ee-whisp/assets/NBR/terraclass_amz_2020")
  tcamz20_pc = tcamz20.eq(12).Or(tcamz20.eq(13))
  tccer20 = ee.Image("projects/ee-whisp/assets/NBR/terraclass_cer_2020")
  tccer20_pc = tccer20.eq(12).Or(tccer20.eq(13))
  tc_pc = ee.ImageCollection([tcamz20_pc, tccer20_pc]).mosaic()
  return tc_pc.rename("nBR_INPE_TCamz_cer_perennial_2020").selfMask()


# [non-official dataset by MapBiomas multisector initiative]
# land use/cover from 1985 up to 2023, collection 9
# Subsetting criteria: 'classification_2020' = coffee (DN=46) <================== COFFEE
# the resulting dataset shows coffee area in 2020
def nbr_mapbiomasc9_cof_prep():
  mapbiomasc9_20 = ee.Image(
      "projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1"
  ).select("classification_2020")
  mapbiomasc9_20_coffee = mapbiomasc9_20.eq(46)
  return mapbiomasc9_20_coffee.rename(
      "nBR_MapBiomas_col9_coffee_2020"
  ).selfMask()


# [non-official dataset by MapBiomas multisector initiative]
# land use/cover from 1985 up to 2023, collection 9
# Subsetting criteria: 'classification_2020' = palm oil (DN=35) <================= PALM OIL
# the resulting dataset shows palm oil area in 2020
def nbr_mapbiomasc9_po_prep():
  mapbiomasc9_20 = ee.Image(
      "projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1"
  ).select("classification_2020")
  mapbiomasc9_20_palm = mapbiomasc9_20.eq(35)
  return mapbiomasc9_20_palm.rename(
      "nBR_MapBiomas_col9_palmoil_2020"
  ).selfMask()


# [non-official dataset by MapBiomas multisector initiative]
# land use/cover from 1985 up to 2023, collection 9
# Subsetting criteria: 'classification_2020' = other perennial crops (DN=48)
# the resulting dataset shows citrus and perennial crops other than coffee and palm oil in 2020
def nbr_mapbiomasc9_pc_prep():
  mapbiomasc9_20 = ee.Image(
      "projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1"
  ).select("classification_2020")
  mapbiomasc9_20_pc = mapbiomasc9_20.eq(35).Or(mapbiomasc9_20.eq(46))
  return mapbiomasc9_20_pc.rename("nBR_MapBiomas_col9_pc_2020").selfMask()


# ######################## NBR commodities - annual crops in 2020:##############################


# %%
# [Official NFMS dataset] INPE/EMBRAPA TerraClass land use/cover in the Amazon biome, 2020
# [Official NFMS dataset] INPE/EMBRAPA TerraClass land use/cover in the Cerrado biome, 2020
# Subsetting criteria: annual/temporary 1 cycle (DN=14) or more than 1 cycle (DN=15)
# the resulting dataset shows temporary crop in 2020
def nbr_terraclass_amz_cer20_ac_prep():
  tcamz20 = ee.Image("projects/ee-whisp/assets/NBR/terraclass_amz_2020")
  tcamz20_ac = tcamz20.eq(14).Or(tcamz20.eq(15))
  tccer20 = ee.Image("projects/ee-whisp/assets/NBR/terraclass_cer_2020")
  tccer20_ac = tccer20.eq(14).Or(tccer20.eq(15))
  tc_ac = ee.ImageCollection([tcamz20_ac, tccer20_ac]).mosaic()
  return tc_ac.rename("nBR_INPE_TCamz_cer_annual_2020").selfMask()


# [non-official dataset by MapBiomas multisector initiative]
# land use/cover from 1985 up to 2023, collection 9
# Subsetting criteria: 'classification_2020' = soybean (DN=39) <================== SOY
# the resulting dataset shows soybean plantation area in 2020
def nbr_mapbiomasc9_soy_prep():
  mapbiomasc9_20 = ee.Image(
      "projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1"
  ).select("classification_2020")
  mapbiomasc9_20_soy = mapbiomasc9_20.eq(39)
  return mapbiomasc9_20_soy.rename("nBR_MapBiomas_col9_soy_2020").selfMask()


# [non-official dataset by MapBiomas multisector initiative]
# land use/cover from 1985 up to 2023, collection 9
# Subsetting criteria: 'classification_2020' = other temporary crops (DN=41)
# Subsetting criteria: 'classification_2020' = sugar cane (DN=20)
# Subsetting criteria: 'classification_2020' = rice (DN=40)
# Subsetting criteria: 'classification_2020' = cotton (beta version, DN=62)
# the resulting dataset shows temporary crop area other than soy, includes sugar cane, rice, and cotton
def nbr_mapbiomasc9_ac_prep():
  mapbiomasc9_20 = ee.Image(
      "projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1"
  ).select("classification_2020")
  mapbiomasc9_20_ac = (
      mapbiomasc9_20.eq(41)
      .Or(mapbiomasc9_20.eq(20))
      .Or(mapbiomasc9_20.eq(40))
      .Or(mapbiomasc9_20.eq(62))
  )
  return mapbiomasc9_20_ac.rename(
      "nBR_MapBiomas_col9_annual_crops_2020"
  ).selfMask()


# ################################### NBR commodities - pasture/livestock in 2020:##############################

# %%
# [Official NFMS dataset] INPE/EMBRAPA TerraClass land use/cover in the Amazon biome, 2020
# Subsetting criteria: BUSH/SHRUB PASTURE (DN=10) or HERBACEOUS PASTURE (DN=11)


# the resulting dataset shows 2020 pasture area in the Amazon
def nbr_terraclass_amz20_pasture_prep():
  tcamz20 = ee.Image("projects/ee-whisp/assets/NBR/terraclass_amz_2020")
  tcamz20_pasture = tcamz20.eq(10).Or(tcamz20.eq(11))
  return tcamz20_pasture.rename("nBR_INPE_TCamz_pasture_2020").selfMask()


# %%
# [Official NFMS dataset] INPE/EMBRAPA TerraClass land use/cover in the Cerrado biome, 2020
# Subsetting criteria: PASTURE (DN=11)
# the resulting dataset shows 2020 pasture area in the Cerrado


def nbr_terraclass_cer20_ac_prep():
  tccer20 = ee.Image("projects/ee-whisp/assets/NBR/terraclass_cer_2020")
  tccer20_pasture = tccer20.eq(11)
  return tccer20_pasture.rename("nBR_INPE_TCcer_pasture_2020").selfMask()


# %%
# [non-official dataset by MapBiomas multisector initiative]
# land use/cover from 1985 up to 2023, collection 9
# Subsetting criteria: 'classification_2020' = pasture (DN=15)
# the resulting dataset shows pasture area in 2020 in Brazil
def nbr_mapbiomasc9_pasture_prep():
  mapbiomasc9_20 = ee.Image(
      "projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1"
  ).select("classification_2020")
  mapbiomasc9_20_pasture = mapbiomasc9_20.eq(15)
  return mapbiomasc9_20_pasture.rename(
      "nBR_MapBiomas_col9_pasture_2020"
  ).selfMask()


###################################################################
# nCO - Colombia


def nco_ideam_forest_2020_prep():
  ideam_forest_raw = ee.Image("projects/ee-whisp/assets/nCO/ideam_2020_geo")
  ideam_forest = ideam_forest_raw.eq(1)  # get forest class
  return ideam_forest.rename("nCO_ideam_forest_2020").selfMask()


def nco_ideam_eufo_commission_2020_prep():
  ideam_agroforest_raw = ee.Image(
      "projects/ee-whisp/assets/nCO/ideam_2020_geo_EUFO"
  )
  ideam_agroforest = ideam_agroforest_raw.eq(4)  # get forest class
  return ideam_agroforest.rename("nCO_ideam_eufo_commission_2020").selfMask()


# Cocoa_bnetd
def nci_ocs2020_prep():
  return (
      ee.Image("BNETD/land_cover/v1/2020")
      .select("classification")
      .eq(9)
      .rename("nCI_Cocoa_bnetd")
  ).selfMask()  # cocoa from national land cover map for Côte d'Ivoire


# nCM - Cameroon
# data from Aurelie Shapiro (FAO) working directly with country experts - info on methods and accuracy assessment to follow


def ncm_treecover_2020_prep():
  return (
      ee.Image("projects/ee-cocoacmr/assets/land_cover/CMR_TNTMMU_2020")
      .select("FNF_2020")
      .eq(1)
      .rename("nCM_Treecover_2020")
      .selfMask()
  )


# ============================================================================
# CONTEXT BANDS (Administrative boundaries and water mask)
# ============================================================================


def g_gaul_admin_code():
  """GAUL 2024 Level 1 administrative boundary codes (500m resolution).

  Used for spatial context and administrative aggregation.

  Returns
  -------
  ee.Image
      Image with admin codes renamed to 'admin_code' (as int32)
  """
  admin_image = ee.Image(
      "projects/ee-andyarnellgee/assets/gaul_2024_level_1_code_500m"
  )
  # Cast to int32 to ensure integer GAUL codes, then rename
  return admin_image.rename("admin_code")


def g_water_mask_prep():
  """Water mask from JRC/USGS combined dataset.

  Used to identify water bodies for downstream filtering and context.

  Multiplied by pixel area to get water area in hectares.

  Returns
  -------
  ee.Image
      Binary water mask image renamed to In_waterbody (will be multiplied by
      pixel area)
  """

  water_mask_image = ee.Image(
      "projects/ee-andyarnellgee/assets/water_mask_jrc_usgs"
  )
  return water_mask_image.selfMask().rename("In_waterbody")


###Combining datasets


def combine_datasets(
    national_codes=None,
    validate_bands=False,
    include_context_bands=True,
    auto_recovery=False,
):
  """Combines datasets into a single multiband image, with fallback if assets are missing.

  Parameters
  ----------
  national_codes : list, optional
      List of ISO2 country codes to include national datasets
  validate_bands : bool, optional
      If True, validates band names with a slow .getInfo() call (default: False)
      Only enable for debugging. Normal operation relies on exception handling.
  include_context_bands : bool, optional
      If True (default), includes context bands (admin_code, water_flag) in the
      output.
      Set to False when using stats.py implementations that compile datasets
      differently.
  auto_recovery : bool, optional
      If True (default), automatically enables validate_bands when an error is
      detected
      during initial assembly. This allows graceful recovery from missing/broken
      datasets.

  Returns
  -------
  ee.Image
      Combined multiband image with all datasets (and optionally context bands)
  """
  # Step 1: Combine all main dataset images
  all_images = [ee.Image(1).rename(geometry_area_column)]
  for func in list_functions(national_codes=national_codes):
    try:
      all_images.append(func())
    except ee.EEException as e:
      print(f"Error loading image: {e}")

  img_combined = ee.Image.cat(all_images)

  # Step 2: Determine if validation needed
  should_validate = validate_bands
  if auto_recovery and not validate_bands:
    try:
      # Fast error detection: batch check main + context bands in one call
      bands_to_check = [img_combined.bandNames().get(0)]
      if include_context_bands:
        admin_image = g_gaul_admin_code()
        water_mask = g_water_mask_prep()
        bands_to_check.extend(
            [admin_image.bandNames().get(0), water_mask.bandNames().get(0)]
        )
      ee.List(bands_to_check).getInfo()  # trigger error if any band is invalid
    except ee.EEException as e:
      print(f"Error detected, enabling recovery mode: {str(e)[:80]}...")
      should_validate = True

  # Step 3: Validate and recover if needed
  if should_validate:
    try:
      img_combined.bandNames().getInfo()  # check all bands
    except ee.EEException as e:
      print("Using valid datasets filter due to error in validation")
      funcs = list_functions(national_codes=national_codes)
      valid_imgs = keep_valid_images(
          [(func.__name__, func()) for func in funcs]
      )
      all_images_retry = [ee.Image(1).rename(geometry_area_column)]
      all_images_retry.extend(valid_imgs)
      img_combined = ee.Image.cat(all_images_retry)

  # Step 4: Multiply main datasets by pixel area
  img_combined = img_combined.multiply(ee.Image.pixelArea())

  # Step 5: Add context bands (admin_code only - water mask is now in prep functions)
  if include_context_bands:
    for band_func, band_name in [
        (g_gaul_admin_code, "admin_code"),
        (g_water_mask_prep, "In_waterbody"),
    ]:
      try:
        band_img = band_func()
        if should_validate:
          band_img.bandNames().getInfo()
        img_combined = img_combined.addBands(band_img)
      except ee.EEException as e:
        print(f"Warning: Could not add {band_name} band: {e}")

  print("Whisp multiband image compiled")
  return img_combined


######helper functions to check images
# list all functions ending with "_prep" (in the current script)
# def list_functions():
#     # Use the module's globals to get all defined functions
#     current_module = inspect.getmodule(inspect.currentframe())
#     functions = [
#         func
#         for name, func in inspect.getmembers(current_module, inspect.isfunction)
#         if name.endswith("_prep")
#     ]
#     return functions


def list_functions(national_codes=None):
  """Returns a list of functions that end with "_prep" and either:

  - Start with "g_" (global/regional products, excluding context bands)
  - Start with any provided national code prefix (nXX_)

  Context band functions (g_gaul_admin_code, g_water_mask_prep) are handled
  separately and excluded from this list to avoid duplication.

  Args:
      national_codes: List of ISO2 country codes (without the 'n' prefix)
  """
  # Use the module's globals to get all defined functions
  current_module = inspect.getmodule(inspect.currentframe())

  # If national_codes is None, default to an empty list
  if national_codes is None:
    national_codes = []

  # Context band functions that are handled separately
  context_functions = {"g_gaul_admin_code", "g_water_mask_prep"}

  # Create prefixes list with proper formatting ('n' + code + '_')
  allowed_prefixes = ["g_"] + [f"n{code.lower()}_" for code in national_codes]

  # Filter functions in a single pass, excluding context band functions
  functions = [
      func
      for name, func in inspect.getmembers(current_module, inspect.isfunction)
      if name.endswith("_prep")
      and any(name.startswith(prefix) for prefix in allowed_prefixes)
      and name not in context_functions
  ]

  return functions


# # IN PROGRESS - expected behaviour
# def filter_by_prefix_list(input_list=None,prefix_list=None):

#     if input_list is None:
#         print ("No function in list")
#     if prefix_list is None:
#         print ("No prefixes listed by which to filter")
#     if input_list is not None:
#         for prefix in prefix_list:
#             if element.startsWith(prefix):
#                 list.


def keep_valid_images(images):
  """Keeps only valid images.

  Args:
      images: list of ee.Image objects, or list of (name, ee.Image) tuples. When
        tuples are provided, the name is used in error messages.
  """
  valid_images = []
  for item in images:
    if isinstance(item, tuple):
      name, img = item
    else:
      name, img = None, item
    try:
      img.getInfo()  # This will raise an exception if the image is invalid
      valid_images.append(img)
    except ee.EEException as e:
      label = f" ({name})" if name else ""
      print(f"Invalid image{label}: {e}")
  return valid_images


# function to check if an image is valid
def ee_image_checker(image):
  """Tests if the input is a valid ee.Image.

  Args:
      image: An ee.Image object.

  Returns:
      bool: True if the input is a valid ee.Image, False otherwise.
  """
  try:
    if ee.Algorithms.ObjectType(image).getInfo() == "Image":
      # Trigger some action on the image to ensure it's a valid image
      image.getInfo()  # This will raise an exception if the image is invalid
      return True
  except ee.EEException as e:
    print(f"Image validation failed with EEException: {e}")
  except Exception as e:
    print(f"Image validation failed with exception: {e}")
  return False
