"""Copied on 21 October 2026 from Whisp datasets.

https://github.com/forestdatapartnership/whisp/blob/main/src/openforis_whisp/datasets.py
"""

from concurrent import futures
from datetime import datetime
import inspect
import logging
import time
import ee

# Defining here instead of importing from config_runtime,
# to allow functioning as more of a standalone script.
geometry_area_column = "Area"

# Calculate current year once at module load time (not in functions)
# This avoids repeated datetime calls and potential .getInfo() calls.
CURRENT_YEAR = datetime.now().year
CURRENT_YEAR_2DIGIT = CURRENT_YEAR % 100  # Last two digits for RADD datasets

# Keep INFO messages from the package's own loggers, without configuring the
# root logger.
if not logging.getLogger().handlers:
  logging.getLogger("openforis_whisp").setLevel(logging.INFO)


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
  # JRC GFC2020 V4 is a single Image with band 'Map' (1 = forest).
  # V3 is deprecated in the GEE catalog and superseded by V4 (released 2026).
  jrc_gfc2020 = ee.Image("JRC/GFC2020/V4").select("Map")
  return jrc_gfc2020.rename("EUFO_2020").selfMask()


# GFC_TC_2020
def g_glad_gfc_10pc_prep():
  gfc = ee.Image("UMD/hansen/global_forest_change_2025_v1_13")
  gfc_treecover2000 = gfc.select(["treecover2000"])
  # lossyear 0 means no loss, so only 1-20 count as loss in 2001-2020
  gfc_loss2001_2020 = (
      gfc.select(["lossyear"]).gt(0).And(gfc.select(["lossyear"]).lte(20))
  )
  gfc_treecover2020 = gfc_treecover2000.where(gfc_loss2001_2020.eq(1), 0)
  return gfc_treecover2020.gt(10).rename("GFC_TC_2020").selfMask()


# GLAD_Primary
def g_glad_pht_prep():
  """Returns primary humid tropical forests 2020 image."""
  primary_ht_forests2001_raw = ee.ImageCollection(
      "UMD/GLAD/PRIMARY_HUMID_TROPICAL_FORESTS/v1"
  )
  primary_ht_forests2001 = (
      primary_ht_forests2001_raw.select("Primary_HT_forests")
      .mosaic()
      .selfMask()
  )
  gfc = ee.Image("UMD/hansen/global_forest_change_2025_v1_13")
  # lossyear 0 means no loss, so only 1-20 count as loss in 2001-2020
  gfc_loss2001_2020 = (
      gfc.select(["lossyear"]).gt(0).And(gfc.select(["lossyear"]).lte(20))
  )
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


# TMF regrowth in 2024
def g_tmf_regrowth_prep():
  # Load the TMF Degradation annual product
  tmf_ac = ee.ImageCollection("projects/JRC/TMF/v1_2025/AnnualChanges").mosaic()
  tmf_ac_2024 = tmf_ac.select("Dec2024")
  regrowth_tmf = tmf_ac_2024.eq(4)
  return regrowth_tmf.rename("TMF_regrowth_2024").selfMask()


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


# ForTy (Google Nature Trace + IIASA) forest typology 2020.
# See https://eartharxiv.org/repository/view/13130. The product stores five
# class score bands (0-250), band index 0=Primary, 1=NaturallyRegenerating,
# 2=Planted, 3=Plantation, 4=TreeCrops/Agroforestry, with a residual
# "other" = 250 - sum. PlantedForest is the weakest class (F1 58.2%), so the
# planted-vs-plantation split is real but uncertain.
#
# Each pixel is assigned its single highest-scoring class via argmax over the
# five score bands plus the residual "other" (= 250 - sum), giving a
# mutually-exclusive, exhaustive 1=Primary..5=TreeCrops, 6=Other label (ties
# resolve to the lowest index, matching the ForTy authors' >= expression). This
# is the product's intended single-label form. It supersedes the earlier
# per-band >= 125 threshold: measured over five regions (S Brazil, Amazon,
# Borneo, Iberia, Congo) the two agreed to 93-100% per class (IoU) and the
# threshold was already >= 99.9% mutually exclusive, so argmax changes each
# forest class by only a few percent (mostly the weak Plantation/Planted
# classes) while guaranteeing the single-label form.
# See temp_dev_notes/forty_classes_assessment.md.
#
# These are PRESENT-BUT-UNUSED output bands: their lookup rows tick no risk
# pathway (use_for_risk_pcrop/acrop/timber all 0), so they surface ForTy
# information in the output without affecting any Ind_/risk_ column.


def _forty_2020_mean():
  return ee.ImageCollection(
      "projects/nature-trace/assets/forest_typology/forest_typology_2020_v1_0_collection"
  ).mean()


def _forty_2020_class():
  # Argmax over the five class scores plus the residual "other" (= 250 - sum).
  # Returns 1=Primary, 2=NaturallyRegenerating, 3=Planted, 4=Plantation,
  # 5=TreeCrops/Agroforestry, 6=Other. arrayArgmax returns the first maximum,
  # so ties resolve to the lowest index (Primary wins), as in the authors'
  # >= ternary.
  scores = _forty_2020_mean().select([0, 1, 2, 3, 4])
  other = scores.reduce(ee.Reducer.sum()).multiply(-1).add(250)
  return scores.addBands(other).toArray().arrayArgmax().arrayGet([0]).add(1)


def _forty_class_present(idx):
  # idx 0=Primary, 1=NaturallyRegenerating, 2=Planted, 3=Plantation,
  # 4=TreeCrops/Agroforestry; argmax class label = idx + 1.
  return _forty_2020_class().eq(idx + 1).selfMask()


def g_forty_primary_2020_prep():
  return _forty_class_present(0).rename("ForTy_primary_2020")


def g_forty_nat_reg_2020_prep():
  return _forty_class_present(1).rename("ForTy_nat_reg_2020")


def g_forty_planted_2020_prep():
  return _forty_class_present(2).rename("ForTy_planted_2020")


def g_forty_plantation_2020_prep():
  return _forty_class_present(3).rename("ForTy_plantation_2020")


def g_forty_tree_crops_2020_prep():
  return _forty_class_present(4).rename("ForTy_tree_crops_2020")


def g_forty_forest_2020_prep():
  # Forest presence = argmax class is one of the four forest classes
  # (1=Primary, 2=NaturallyRegenerating, 3=Planted, 4=Plantation), i.e. a
  # forest class outscores TreeCrops and "other" at the pixel.
  return _forty_2020_class().lte(4).selfMask().rename("ForTy_forest_2020")


# SBTN_natural_2020
def g_sbtn_natural_2020_prep():
  return (
      ee.Image("WRI/SBTN/naturalLands/v1_1/2020")
      .select("natural")
      .eq(1)
      .rename("SBTN_natural_2020")
      .selfMask()
  )


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

  # Plantations dated 2020 or earlier. The band is days since 1970-01-01,
  # compared directly (18628 = 2021-01-01): dividing by 365 drifts with leap
  # days and read 19-31 Dec 2020 as 2021.
  plantation_2020 = img.lt(18628)
  return plantation_2020.rename("Oil_palm_Descals").selfMask()


# Cocoa_ETH
def g_eth_kalischek_cocoa_prep():
  return (
      ee.Image("projects/ee-nk-cocoa/assets/cocoa_map_threshold_065")
      .rename("Cocoa_ETH")
      .selfMask()
  )


# fdap datasets

# Thresholds and model info here:
# https://github.com/google/forest-data-partnership/tree/main/models/model_2026a


# Oil Palm FDaP
def g_fdap_palm_prep():
  fdap_palm2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/palm/model_2026a"
  )
  fdap_palm = (
      fdap_palm2020_model_raw.filterDate("2020-01-01", "2020-12-31")
      .mosaic()
      .gt(0.47)
  )
  return fdap_palm.rename("Oil_palm_FDaP").selfMask()


def g_fdap_palm_2024_prep():
  fdap_palm2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/palm/model_2026a"
  )
  fdap_palm = (
      fdap_palm2020_model_raw.filterDate("2024-01-01", "2024-12-31")
      .mosaic()
      .gt(0.47)
  )
  return fdap_palm.rename("Oil_palm_2024_FDaP").selfMask()


# Cocoa FDaP
def g_fdap_cocoa_prep():
  fdap_cocoa2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/cocoa/model_2026a"
  )
  fdap_cocoa = (
      fdap_cocoa2020_model_raw.filterDate("2020-01-01", "2020-12-31")
      .mosaic()
      .gt(0.54)
  )
  return fdap_cocoa.rename("Cocoa_FDaP").selfMask()


def g_fdap_cocoa_2024_prep():
  fdap_cocoa2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/cocoa/model_2026a"
  )
  fdap_cocoa = (
      fdap_cocoa2020_model_raw.filterDate("2024-01-01", "2024-12-31")
      .mosaic()
      .gt(0.54)
  )
  return fdap_cocoa.rename("Cocoa_2024_FDaP").selfMask()


# Rubber FDaP
def g_fdap_rubber_prep():
  fdap_rubber2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/rubber/model_2026a"
  )
  fdap_rubber = (
      fdap_rubber2020_model_raw.filterDate("2020-01-01", "2020-12-31")
      .mosaic()
      .gt(0.35)
  )
  return fdap_rubber.rename("Rubber_FDaP").selfMask()


def g_fdap_rubber_2024_prep():
  fdap_rubber2020_model_raw = ee.ImageCollection(
      "projects/forestdatapartnership/assets/rubber/model_2026a"
  )
  fdap_rubber = (
      fdap_rubber2020_model_raw.filterDate("2024-01-01", "2024-12-31")
      .mosaic()
      .gt(0.35)
  )
  return fdap_rubber.rename("Rubber_2024_FDaP").selfMask()


# # Coffee FDaP
def g_fdap_coffee_2020_prep():
  # Load the coffee model for 2020
  collection = ee.ImageCollection(
      "projects/forestdatapartnership/assets/coffee/model_2026a"
  )

  # Filter the collection for the year 2020 and create a binary mask
  coffee_2020 = (
      collection.filterDate("2020-01-01", "2020-12-31").mosaic().gt(0.33)
  )

  return coffee_2020.rename("Coffee_FDaP").selfMask()


def g_fdap_coffee_2024_prep():
  # Load the coffee model
  collection = ee.ImageCollection(
      "projects/forestdatapartnership/assets/coffee/model_2026a"
  )

  # Filter the collection for the year 2024 and create a binary mask
  coffee_2024 = (
      collection.filterDate("2024-01-01", "2024-12-31").mosaic().gt(0.33)
  )
  return coffee_2024.rename("Coffee_FDaP_2024").selfMask()


# Rubber_RBGE_2020 - RBGE's 10m SEA rubber map (Ahrends et al. 2026), replacing
# the Wang et al. 2023 map Whisp carried as Rubber_RBGE, which its providers
# have marked superseded.
# Called _2020 even though the imagery is 2021 for mainland SEA and 2019 for
# Indonesia: the authors designate it as representing 2020, which works here
# because the map targets mature rubber, and rubber takes about 7 years to reach
# tapping, so nothing planted after the cutoff can appear in it.
# It under-maps rubber in Indonesia and Malaysia (cloud cover, weak phenological
# signal). Worth knowing, because a commodity present in 2020 makes a plot low
# risk, so rubber this map misses costs plots that low outcome rather than
# flagging them.
# Two bands, "rubber" and "no_data"; selecting rubber then selfMask drops
# no_data as not-rubber.
def g_rbge_rubber_2020_prep():
  return (
      ee.Image("projects/rubber-499107/assets/rubber_SEA_2020")
      .select("rubber")
      .rename("Rubber_RBGE_2020")
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
# ESRI 2024


# ESRI 2024 - Tree Cover
def g_esri_2024_tc_prep():
  esri_lulc10_raw = ee.ImageCollection(
      "projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS"
  )
  esri_lulc10_tc = (
      esri_lulc10_raw.filterDate("2024-01-01", "2024-12-31").mosaic().eq(2)
  )
  return esri_lulc10_tc.rename("ESRI_2024_TC").selfMask()


# ESRI 2024 - Crop
def g_esri_2020_2024_crop_prep():
  """Returns ESRI crop gain 2020-2024 image."""
  esri_lulc10_raw = ee.ImageCollection(
      "projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS"
  )
  esri_lulc10_crop_2020 = (
      esri_lulc10_raw.filterDate("2020-01-01", "2020-12-31").mosaic().eq(5)
  )
  esri_lulc10_crop_2024 = (
      esri_lulc10_raw.filterDate("2024-01-01", "2024-12-31").mosaic().eq(5)
  )

  new_crop = esri_lulc10_crop_2024.And(esri_lulc10_crop_2020.Not())

  return new_crop.rename("ESRI_crop_gain_2020_2024").selfMask()


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

  years = ee.List.sequence(start_year, current_year)
  first_year = ee.Number(years.get(0))
  start = first_year.multiply(1000)
  end = first_year.multiply(1000).add(
      366
  )  # 366 so 31 Dec of a leap year is kept
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
    end = year_num.multiply(1000).add(366)
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


# TMF_def_2000 to TMF_def_2025
def g_tmf_def_per_year_prep():
  # Load the TMF Deforestation annual product
  tmf_def = ee.ImageCollection(
      "projects/JRC/TMF/v1_2025/DeforestationYear"
  ).mosaic()
  img_stack = None
  # One band of TMF deforestation per year from 2000 to 2025
  for i in range(0, 25 + 1):
    year_num = ee.Number(2000 + i)
    band_name = ee.String("TMF_def_").cat(year_num.format("%d"))
    tmf_def_year = tmf_def.eq(year_num).rename(band_name).selfMask()
    if img_stack is None:
      img_stack = tmf_def_year
    else:
      img_stack = img_stack.addBands(tmf_def_year)
  return img_stack


# TMF_deg_2000 to TMF_deg_2025
def g_tmf_deg_per_year_prep():
  # Load the TMF Degradation annual product
  tmf_def = ee.ImageCollection(
      "projects/JRC/TMF/v1_2025/DegradationYear"
  ).mosaic()
  img_stack = None
  # One band of TMF degradation per year from 2000 to 2025
  for i in range(0, 25 + 1):
    year_num = ee.Number(2000 + i)
    band_name = ee.String("TMF_deg_").cat(year_num.format("%d"))
    tmf_def_year = tmf_def.eq(year_num).rename(band_name).selfMask()
    if img_stack is None:
      img_stack = tmf_def_year
    else:
      img_stack = img_stack.addBands(tmf_def_year)
  return img_stack


# GFC_loss_year_2001 to GFC_loss_year_2025 (correct for version 13)
def g_glad_gfc_loss_per_year_prep():
  # Load the Global Forest Change dataset
  gfc = ee.Image("UMD/hansen/global_forest_change_2025_v1_13")
  img_stack = None
  # Generate an image based on GFC with one band of forest tree loss per year
  # from 2001 to 2025.
  for i in range(1, 25 + 1):
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

  # Years run to CURRENT_YEAR rather than asking EE for the latest image date,
  # which cost a getInfo() round trip every time the whisp image was built
  # (tried once in 1770c2c, reverted in 74039a5 because an unpublished year then
  # broke the band). Early in the year MODIS has no images yet for the current
  # year, and mosaic() of an empty collection has no BurnDate band to select.
  # Merging in a fully masked BurnDate placeholder keeps the band there: an
  # unpublished year comes out as all masked (same as no fire) and real images
  # are unaffected. Same idea as _glad_l_conf.
  end_year = CURRENT_YEAR
  burn_date_placeholder = ee.ImageCollection(
      [ee.Image(0).rename("BurnDate").selfMask()]
  )

  img_stack = None

  for year in range(start_year, end_year + 1):
    year_num = ee.Number(year)
    band_name = ee.String("MODIS_fire_").cat(year_num.format("%d"))
    date_st = f"{year}-01-01"
    date_ed = f"{year}-12-31"
    modis_year = (
        modis_fire.filterDate(date_st, date_ed)
        .select(["BurnDate"])
        .merge(burn_date_placeholder)
        .mosaic()
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

  # FireCCI 5.1 is a finished product ending in 2020, so the end year is fixed
  # rather than read from the collection with a getInfo() call on every image
  # build.
  end_year = 2020

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
  end = current_year * 1000 + 366  # 366 so 31 Dec of a leap year is kept
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
  end = 20 * 1000 + 366  # 366 so 31 Dec 2020 (leap year) is kept
  return (
      radd_date.updateMask(radd_date.gte(start))
      .updateMask(radd_date.lte(end))
      .gt(0)
      .rename("RADD_before_2020")
  ).selfMask()


# DIST_after_2020


# DIST alerts are for all veg types so masked by EUFO forest 2020
# NB alerts only for 2024 onwards (in GEE at least, available for 2023 from the
# GLAD site) for consistency using "...after_2020..." terminology.
def g_glad_dist_after_2020_prep():
  """Returns GLAD DIST alerts after 2020 masked to EUFO 2020 forest."""
  # no need to filter by date as all dates are later than 2023

  # Load the vegetation disturbance collections
  veg_dist_status = ee.ImageCollection(
      "projects/glad/HLSDIST/current/VEG-DIST-STATUS"
  ).mosaic()

  # Key for high-confidence alerts (values 3, 6, 7, 8)
  high_conf_values = [3, 6, 7, 8]

  # Create high-confidence mask
  dist_high_conf = veg_dist_status.remap(
      high_conf_values, [1] * len(high_conf_values), 0
  )

  return dist_high_conf.updateMask(g_jrc_gfc_2020_prep()).rename(
      "DIST_after_2020"
  )  # Mask alerts to forest and rename band


# DIST_alert_2024 to DIST_alert_< current year >
# Notes:
# 1) so far only available for 2024 onwards in GEE
# 2) masked alerts (as dist alerts are for all vegetation) to JRC EUFO 2020
#    layer, as close to EUDR definition


def g_glad_dist_year_prep():
  """GLAD DIST alerts per year as multiband image.

  Each band is binary (1 = high-confidence disturbance alert). Uses
  VEG-DIST-DATE to filter by year, VEG-DIST-STATUS for confidence. Masked to
  EUFO 2020 forest. Note: Only available from 2024 onwards. Fully server-side
  using ee.List.iterate (no Python for loop).

  Returns:
    ee.Image: Multiband image of annual GLAD DIST alerts.
  """
  # Load the vegetation disturbance collections
  #  Vegetation disturbance status (0-8, class flag, 8-bit)
  veg_dist_status = ee.ImageCollection(
      "projects/glad/HLSDIST/current/VEG-DIST-STATUS"
  ).mosaic()
  # Initial vegetation disturbance date (>0: days since 2020-12-31, 16-bit)
  veg_dist_date = ee.ImageCollection(
      "projects/glad/HLSDIST/current/VEG-DIST-DATE"
  ).mosaic()

  # Key for high-confidence alerts (values 3, 6, 7, 8)
  # 3 = <50% loss, high confidence, ongoing
  # 6 = ≥50% loss, high confidence, ongoing
  # 7 = <50% loss, high confidence, finished
  # 8 = ≥50% loss, high confidence, finished
  high_conf_values = [3, 6, 7, 8]
  dist_high_conf = veg_dist_status.remap(
      high_conf_values, [1] * len(high_conf_values), 0
  )

  # Year range: 2024 to current year
  start_year = 2024
  end_year = CURRENT_YEAR

  # Reference date for day offset calculation (2020-12-31)
  ref_date = ee.Date("2020-12-31")

  # Create first band (2024)
  first_year = ee.Number(start_year)
  first_start_days = ee.Date.fromYMD(first_year, 1, 1).difference(
      ref_date, "day"
  )
  first_end_days = ee.Date.fromYMD(first_year.add(1), 1, 1).difference(
      ref_date, "day"
  )
  first_year_mask = veg_dist_date.gte(first_start_days).And(
      veg_dist_date.lt(first_end_days)
  )
  first_band_name = ee.String("DIST_year_").cat(first_year.format("%d"))
  first_band = (
      first_year_mask.updateMask(dist_high_conf)
      .rename(first_band_name)
      .selfMask()
  )

  # Server-side iteration to add remaining years
  years = ee.List.sequence(start_year + 1, end_year)

  def add_year_band(year, img_stack):
    year_num = ee.Number(year)
    start_days = ee.Date.fromYMD(year_num, 1, 1).difference(ref_date, "day")
    end_days = ee.Date.fromYMD(year_num.add(1), 1, 1).difference(
        ref_date, "day"
    )
    year_mask = veg_dist_date.gte(start_days).And(veg_dist_date.lt(end_days))
    band_name = ee.String("DIST_year_").cat(year_num.format("%d"))
    year_band = (
        year_mask.updateMask(dist_high_conf).rename(band_name).selfMask()
    )
    return ee.Image(img_stack).addBands(year_band)

  img_stack = ee.Image(years.iterate(add_year_band, first_band))

  # Mask to EUFO 2020 forest
  return img_stack.updateMask(g_jrc_gfc_2020_prep())


# GLAD-L (GLAD Landsat) Alerts
# Coverage: Entire tropics (30°N to 30°S) from January 1, 2018 to present,
#           and from 2015 to present for select countries in the Amazon,
#           Congo Basin, and insular Southeast Asia.
# Uses confidence bands per year where values >= 2 are confirmed alerts
# Asset paths per year:
#   2021: projects/glad/alert/2021final (conf21)
#   2022: projects/glad/alert/2022final (conf22)
#   2023: projects/glad/alert/2023final (conf23)
#   2024: projects/glad/alert/2023final (conf24 - GLAD put 2024 in the
#         2023final asset; no 2024final)
#   2025+: projects/glad/alert/UpdResult (conf25, conf26, ...; newest year via
#          CURRENT_YEAR_2DIGIT)
# More info: https://glad.umd.edu/dataset/glad-forest-alerts


# GLAD-L confidence bands live in per-year "YYYYfinal" assets for 2017-2024
# (2024 sits in the 2023final asset - GLAD did not publish a 2024final) and in
# the rolling "UpdResult" collection for 2025 onward. UpdResult is continuously
# reprocessed and its tiles do NOT all carry the same year bands (e.g. mid-2026
# the two South America tiles 07_28_SA / 07_29_SA dropped conf25), so a plain
# .mosaic() over the raw multi-band collection raises "Expected a homogeneous
# image collection". _glad_l_conf mosaics a SINGLE confidence band tolerantly:
# tiles missing it contribute a masked placeholder, so the collection is
# homogeneous and mosaic never throws, and a not-yet-published future year
# simply contributes nothing. Fully server-side (ee.Algorithms.If) - no
# getInfo().
def _glad_l_asset_for_year(yy):
  if 17 <= yy <= 23:
    return f"projects/glad/alert/20{yy:02d}final"
  if yy == 24:
    return (  # GLAD placed 2024 (conf24) in the 2023final asset
        "projects/glad/alert/2023final"
    )
  return "projects/glad/alert/UpdResult"  # 2025 onward (and any future year)


def _glad_l_conf(collection_id, yy):
  """Mosaics a single confidence band tolerantly across a GLAD-L collection.

  Args:
    collection_id: The Earth Engine ImageCollection asset ID.
    yy: Two-digit year (e.g., 21 for 2021).

  Returns:
    ee.Image: Mosaic of the confidence band for the given year.
  """
  band = f"conf{yy:02d}"
  coll = ee.ImageCollection(collection_id)

  def _pick(img):
    img = ee.Image(img)
    return ee.Image(
        ee.Algorithms.If(
            img.bandNames().contains(band),
            img.select(band),
            ee.Image(0)
            .rename(band)
            .selfMask(),  # masked placeholder -> homogeneous collection
        )
    )

  return ee.ImageCollection(coll.map(_pick)).mosaic()


def _glad_l_alert(yy):
  """Binary confirmed-alert (confidence >= 2) presence for GLAD-L year 20YY."""
  # unmask so a year/tile with no data counts as "no alert" and does not mask
  # the other years in .Or()
  return _glad_l_conf(_glad_l_asset_for_year(yy), yy).gte(2).unmask(0, False)


# GLAD-L_after_2020 (combined confirmed alerts from 2021 to the current year,
# incl. 2024)
def g_glad_l_after_2020_prep():
  """GLAD Landsat confirmed alerts (confidence >= 2) combined from 2021 onward.

  Years are driven off CURRENT_YEAR_2DIGIT so new years are picked up
  automatically, and the tolerant per-band mosaic (see _glad_l_conf) keeps it
  working as GLAD reprocesses UpdResult tiles.

  Returns:
    ee.Image: Binary image of confirmed GLAD-L alerts after 2020.
  """
  combined = _glad_l_alert(21)
  for yy in range(22, CURRENT_YEAR_2DIGIT + 1):  # 2021..current (includes 2024)
    combined = combined.Or(_glad_l_alert(yy))
  return combined.rename("GLAD-L_after_2020").selfMask()


# GLAD-L_before_2020 (combined confirmed alerts from 2017 to 2020)
def g_glad_l_before_2020_prep():
  """GLAD Landsat confirmed alerts (confidence >= 2) combined from 2017-2020.

  Note: 2015 and 2016 assets are not available in GEE. Coverage: tropics (30N to
  30S). Uses the tolerant per-band mosaic (see _glad_l_conf).

  Returns:
    ee.Image: Binary image of confirmed GLAD-L alerts from 2017 to 2020.
  """
  combined = _glad_l_alert(17)
  for yy in range(18, 21):  # 2017..2020
    combined = combined.Or(_glad_l_alert(yy))
  return combined.rename("GLAD-L_before_2020").selfMask()


# GLAD-L timeseries - one confirmed-alert band per year (2017 -> current year)
def g_glad_l_year_prep():
  """GLAD Landsat confirmed alerts (confidence >= 2) as one band per year.

  Covers 2017 to the current year. 2024 is included (GLAD placed conf24 in the
  2023final asset). Coverage: tropics (30N-30S); 2015/2016 assets do not exist
  in GEE. Each band uses the tolerant per-band mosaic (see _glad_l_conf).
  Lookup rows for new years are added automatically (YEAR_SERIES_TO_CURRENT_YEAR
  in config_runtime).

  Returns:
    ee.Image: Multiband image of annual GLAD-L alerts.
  """
  img_stack = None
  for yy in range(17, CURRENT_YEAR_2DIGIT + 1):  # 2017..current (includes 2024)
    band = _glad_l_alert(yy).rename(f"GLAD-L_year_20{yy:02d}").selfMask()
    img_stack = band if img_stack is None else img_stack.addBands(band)
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

  # Date encoding: days counted from 2018-12-31. 0 means no alert (GLAD's
  # example script, linked from
  # https://glad.geog.umd.edu/dataset/glad-forest-alerts, masks it with
  # selfMask), so 1 = 2019-01-01 and 731 = 2020-12-31. Alert dates match
  # Sentinel-2 acquisition days on this reading.
  days_end_2020 = 731

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

  # Date encoding: days counted from 2018-12-31. 0 means no alert (GLAD's
  # example script, linked from
  # https://glad.geog.umd.edu/dataset/glad-forest-alerts, masks it with
  # selfMask), so 1 = 2019-01-01 and 731 = 2020-12-31. Alert dates match
  # Sentinel-2 acquisition days on this reading.
  days_end_2020 = 731

  # Filter alerts up to end of 2020 with confidence >= 2
  alerts_before_2020 = s2alert.gte(2).And(alert_date.lte(days_end_2020))

  return alerts_before_2020.rename("GLAD-S2_before_2020").selfMask()


# GLAD-S2 timeseries - multiband image with one band per year
def g_glad_s2_year_prep():
  """GLAD Sentinel-2 alerts per year as multiband image.

  Each band is binary (1 = alert with confidence >= 2). Coverage: Primary humid
  tropical forest areas of South America

            from January 2019 to present.
  Date encoding: days counted from 2018-12-31 (1 = 2019-01-01; 0 = no alert).
  Includes years from 2019 onwards.
  """
  col = "projects/glad/S2alert"
  s2alert = ee.Image(col + "/alert")
  alert_date = ee.Image(col + "/alertDate")

  # Confidence threshold for confirmed alerts
  confirmed = s2alert.gte(2)

  # Date encoding: days counted from 2018-12-31. 0 means no alert (GLAD's
  # example script, linked from
  # https://glad.geog.umd.edu/dataset/glad-forest-alerts, masks it with
  # selfMask), so 1 = 2019-01-01 and 731 = 2020-12-31. Alert dates match
  # Sentinel-2 acquisition days on this reading.
  # Year boundaries: 2019-01-01 = 1, 2020-01-01 = 366, 2021-01-01 = 732,
  # 2022-01-01 = 1097.
  ref_date = ee.Date("2018-12-31")

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


# GFC_loss_before_2020 (loss within 10 percent cover; includes 2020; correct for
# version 13)
def g_glad_gfc_loss_before_2020_prep():
  # Load the Global Forest Change dataset
  gfc = ee.Image("UMD/hansen/global_forest_change_2025_v1_13")
  # lossyear 0 means no loss, so only 1-20 count as loss in 2001-2020
  gfc_loss = (
      gfc.select(["lossyear"])
      .gt(0)
      .And(gfc.select(["lossyear"]).lte(20))
      .And(gfc.select(["treecover2000"]).gt(10))
  )
  return gfc_loss.rename("GFC_loss_before_2020").selfMask()


# GFC_loss_after_2020 (loss within 10 percent cover; correct for version 13)
def g_glad_gfc_loss_after_2020_prep():
  # Load the Global Forest Change dataset
  gfc = ee.Image("UMD/hansen/global_forest_change_2025_v1_13")
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
  # Use pre-calculated current year (avoids repeated datetime calls).
  # Runs to the current year like the per-year MODIS_fire bands; the filter
  # simply finds no images for months not yet published.
  end_year = CURRENT_YEAR
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
      "nBR_INPE_TCsilviculture_Amazon_2020"  # pragma: allowlist secret
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


# [Official NFMS dataset] INPE PRODES deforestation up to Dec 2020, corrected
# for EUDR cutoff date. Replaces prodes_brasil_2023 remap for the before-2020
# layer. New asset uses Dec 31 2020 as cutoff (PRODES normally uses Aug 1);
# DN classes: 11, 21, 31, 41, 51, 61.
def nbr_prodes_before_2020_prep():
  prodes = ee.Image("projects/ee-whisp/assets/NBR/nbr_inpe_prodes_dec2020")
  prodes_before_20_dn = [11, 21, 31, 41, 51, 61]
  prodes_before_20_mask = prodes.remap(
      prodes_before_20_dn, [1] * len(prodes_before_20_dn)
  )
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
  ).filter(ee.Filter.lt("formatted_date", ee.Date("2021-01-01")))

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
  ).filter(ee.Filter.gte("formatted_date", ee.Date("2021-01-01")))

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
# Subsetting criteria: 'classification_2020' = citrus (DN=47) and other
# perennial crops (DN=48)
# the resulting dataset shows citrus and perennial crops other than coffee and
# palm oil in 2020
#
# Why citrus and other perennials are here although they are not EUDR
# commodities: this layer feeds the "commodities" indicator, which asks whether
# a plot was already under agricultural use at the end of 2020 (see README), not
# whether the crop is regulated. Under the EUDR a fruit tree plantation is
# agricultural use, not forest, so an orchard that shows up as tree cover in
# 2020 must not be read as forest that was later cleared. The annual crops layer
# below includes sugar cane, rice and cotton for the same reason.
#
# MapBiomas legend, perennial crop classes: 35 = palm oil, 46 = coffee,
# 47 = citrus, 48 = other perennial crops. Palm oil and coffee have their own
# layers above (nbr_mapbiomasc9_po_prep, nbr_mapbiomasc9_cof_prep), so they are
# left out here. Until October 2026 this function selected 35 and 46 by mistake,
# which duplicated those two layers and left citrus and other perennials out of
# the indicator.
def nbr_mapbiomasc9_pc_prep():
  mapbiomasc9_20 = ee.Image(
      "projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1"
  ).select("classification_2020")
  mapbiomasc9_20_pc = mapbiomasc9_20.eq(47).Or(mapbiomasc9_20.eq(48))
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
      Image with admin codes renamed to 'admin_code'
  """
  admin_image = ee.Image(
      "projects/ee-andyarnellgee/assets/gaul_2024_level_1_code_500m"
  )
  # Rename only (no cast: the band keeps the asset's own type)
  return admin_image.rename("admin_code")


def g_water_mask_prep():
  """Water mask from JRC/USGS combined dataset.

  Used to identify water bodies for downstream filtering and context.

  A context band: unlike the dataset bands it is not multiplied by pixel area.

  Returns
  -------
  ee.Image
      Binary water mask image renamed to In_waterbody (not converted to area)
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
  """Combines datasets into a single multiband image.

  By default building the image makes no calls to Earth Engine, so a broken or
  missing asset only shows up when the image is used. The stats functions catch
  that error, rebuild the image without the broken dataset(s) using
  combine_datasets_without_broken(), and carry on.

  If you build the image yourself and pass it in (e.g. to add custom bands), the
  stats functions can't rebuild it for you, so use auto_recovery=True here: one
  quick check up front, and broken datasets are left out before you add anything
  to the image.

  Args:
    national_codes: List of ISO2 country codes to include national datasets.
    validate_bands: Same as auto_recovery (default: False). Kept for existing
      calls.
    include_context_bands: If True (default), includes context bands
      (admin_code, In_waterbody) in the output. Set to False when using stats.py
      implementations that compile datasets differently.
    auto_recovery: If True, make one quick Earth Engine call to check every
      dataset loads, and only if that fails check each dataset (in parallel) and
      leave out the broken ones (default: False).

  Returns:
    ee.Image: Combined multiband image with all datasets (and optionally context
    bands).
  """
  # Combine all main dataset images and convert to area per pixel
  all_images = [ee.Image(1).rename(geometry_area_column)]
  for func in list_functions(national_codes=national_codes):
    try:
      all_images.append(func())
    except ee.EEException as e:
      print(f"Error loading image: {e}")

  img_combined = ee.Image.cat(all_images).multiply(ee.Image.pixelArea())

  # Add context bands (admin_code, In_waterbody), which are not converted to
  # area.
  if include_context_bands:
    for band_func, band_name in _context_bands():
      try:
        img_combined = img_combined.addBands(band_func())
      except ee.EEException as e:
        print(f"Warning: Could not add {band_name} band: {e}")

  # Optional up-front check: one call that makes Earth Engine load every
  # dataset. Only if it fails are the datasets checked one by one (in parallel)
  # and the broken ones left out.
  if auto_recovery or validate_bands:
    try:
      img_combined.bandNames().size().getInfo()
    except ee.EEException as e:
      if not is_dataset_error(e):
        raise  # e.g. quota or connection trouble: not a reason to drop datasets
      print(
          "Warning: a dataset failed to load, leaving out broken ones:"
          f" {str(e)[:150]}"
      )
      img_combined, _ = combine_datasets_without_broken(
          national_codes=national_codes,
          include_context_bands=include_context_bands,
      )
      return img_combined

  print("Whisp multiband image compiled")
  return img_combined


def _context_bands():
  """Context band functions and their band names, added after the area conversion."""
  return [
      (g_gaul_admin_code, "admin_code"),
      (g_water_mask_prep, "In_waterbody"),
  ]


# Parts of Earth Engine error messages that mean a dataset itself is broken:
# asset missing, moved or not shared, band renamed, a collection whose images no
# longer have matching bands, or a collection that has gone empty (its mosaic
# "has no bands", how the DIST alerts broke, #182). Anything else (quota,
# timeouts, memory, server trouble, wording we haven't seen) is left to the
# normal retry handling rather than treated as a broken dataset.
_DATASET_ERROR_SIGNS = (
    "image.load",
    "imagecollection.load",
    "not found",
    "does not exist",
    "doesn't allow this operation",
    "did not match any bands",
    "homogeneous image collection",
    "has no bands",
)


def is_dataset_error(exc):
  """Returns True if exc is an Earth Engine error indicating a broken dataset.

  Broken dataset errors include missing or unshared assets, renamed bands, or
  mismatched bands in a collection. Only these trigger a rebuild of the image
  without broken datasets; any other error keeps the normal retry handling.

  Args:
    exc: The exception to inspect.

  Returns:
    bool: True if exc indicates a broken dataset, False otherwise.
  """
  if not isinstance(exc, ee.EEException):
    return False
  message = str(exc).lower()
  return any(sign in message for sign in _DATASET_ERROR_SIGNS)


def _find_broken_images(
    named_images, probe=None, max_workers=8, skip_other_errors=False
):
  """Returns names of the images that fail a check, run in parallel.

  By default the check asks for the band names; `probe(img)` can give a heavier
  check (see _pixel_probe). Only a dataset error counts as broken: any other
  error (e.g. rate limiting while checking) is tried once more and then raised,
  or with skip_other_errors that one dataset is just treated as fine, so a
  healthy dataset is never dropped by mistake and one flaky check doesn't sink
  the rest.

  Args:
    named_images: Iterable of (name, ee.Image) pairs to check.
    probe: Optional callable taking an ee.Image and returning an EE object to
      call getInfo() on.
    max_workers: Maximum number of worker threads.
    skip_other_errors: Whether to ignore non-dataset errors after retrying.

  Returns:
    list[str]: Names of images that failed with a dataset error.
  """
  probe = probe or (lambda img: img.bandNames())

  def _check(item):
    name, img = item
    for attempt in range(2):
      try:
        probe(img).getInfo()
        return None
      except Exception as e:  # pylint: disable=broad-exception-caught
        if isinstance(e, ee.EEException) and is_dataset_error(e):
          print(f"Invalid image ({name}): {e}")
          return name
        if attempt == 1:
          if skip_other_errors:
            print(f"Warning: could not check {name}: {str(e)[:150]}")
            return None
          raise
        time.sleep(2)

  with futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
    results = list(executor.map(_check, named_images))
  return [name for name in results if name is not None]


def _pixel_probe(region):
  """Returns a probe function that makes Earth Engine compute pixels.

  Used for errors that only appear during pixel computation (e.g. a collection
  whose images no longer have matching bands, #248). Each dataset is reduced to
  one pixel count summed over `region` (the polygons the run failed on) at the
  run's 10 m scale.

  Args:
    region: ee.FeatureCollection of polygons to compute pixels over.

  Returns:
    Callable[[ee.Image], ee.ComputedObject]: Probe function for an image.
  """

  def probe(img):
    count = img.reduce(ee.Reducer.count())
    return count.reduceRegions(
        collection=region, reducer=ee.Reducer.sum(), scale=10
    ).aggregate_sum("sum")

  return probe


def combine_datasets_without_broken(
    national_codes=None,
    include_context_bands=True,
    probe_region=None,
    force_probe=False,
):
  """Builds the whisp image leaving out any dataset that Earth Engine cannot load.

  This is the slow path, used after processing has failed with a dataset error
  (or when combine_datasets finds one with auto_recovery=True). Each dataset
  gets its own bandNames() check, run in parallel, so it costs one round of
  requests rather than one per dataset in turn.

  If that finds nothing and `probe_region` (the polygons the run failed on) is
  given, each dataset is checked again by computing pixels there (#249), which
  catches errors a band check can't, like the mismatched GLAD-L tiles in #248.

  If more than half the datasets fail, that points to an access or connection
  problem rather than broken datasets, so a RuntimeError is raised instead of
  dropping them.

  Args:
    national_codes: List of ISO2 country codes to include national datasets.
    include_context_bands: If True (default), includes context bands
      (admin_code, In_waterbody) in the output.
    probe_region: Polygons to compute pixels over if the band check finds
      nothing broken.
    force_probe: Compute pixels over probe_region even if the band check found
      something (used when a run still fails after a first rebuild, e.g. a
      pixel-level error behind a dead asset).

  Returns:
    tuple[ee.Image, list[str]]: The combined image and the names of the prep
    functions that were left out.

  Raises:
    RuntimeError: If more than half of the datasets fail to load.
  """
  dropped = []

  main_images = []
  for func in list_functions(national_codes=national_codes):
    try:
      main_images.append((func.__name__, func()))
    except ee.EEException as e:
      print(f"Invalid image ({func.__name__}): {e}")
      dropped.append(func.__name__)

  context_images = []
  if include_context_bands:
    for band_func, band_name in _context_bands():
      try:
        context_images.append((band_func.__name__, band_func()))
      except ee.EEException as e:
        print(f"Warning: Could not add {band_name} band: {e}")
        dropped.append(band_func.__name__)

  all_images = main_images + context_images
  broken = set(_find_broken_images(all_images))
  if probe_region is not None and (force_probe or not (broken or dropped)):
    print("Checking each dataset's pixels where the run failed...")
    survivors = [(name, img) for name, img in all_images if name not in broken]
    # A timeout or memory limit while checking one dataset says nothing about
    # it, so that dataset counts as fine (the caller raises the original error
    # if nothing is found).
    broken |= set(
        _find_broken_images(
            survivors, probe=_pixel_probe(probe_region), skip_other_errors=True
        )
    )
  dropped.extend(name for name, _ in all_images if name in broken)

  if len(dropped) > (len(all_images) + len(dropped) - len(broken)) / 2:
    raise RuntimeError(
        f"{len(dropped)} of the whisp datasets failed to load, which looks like"
        " an Earth Engine access or connection problem rather than broken"
        " datasets, so none were dropped. Check your Earth Engine login and"
        " project and try again."
    )

  img_combined = ee.Image.cat(
      [ee.Image(1).rename(geometry_area_column)]
      + [img for name, img in main_images if name not in broken]
  ).multiply(ee.Image.pixelArea())
  for name, img in context_images:
    if name not in broken:
      img_combined = img_combined.addBands(img)

  if dropped:
    print(f"Warning: left out broken dataset(s): {', '.join(dropped)}")
  print("Whisp multiband image compiled")
  return img_combined, dropped


def unavailable_dataset_names(func_names):
  """Returns short names for dropped datasets as they appear in output columns.

  Falls back to the function name without its g_/_prep parts.

  Args:
    func_names: Iterable of dataset preparation function names.

  Returns:
    list[str]: Short dataset names.
  """
  context_names = {
      "g_gaul_admin_code": "admin_code",
      "g_water_mask_prep": "In_waterbody",
  }
  names = []
  for func_name in func_names:
    if func_name in context_names:
      names.append(context_names[func_name])
    else:
      names.append(func_name.removeprefix("g_").removesuffix("_prep"))
  return names


def supplied_image_error(error):
  """Returns the error raised when a caller-supplied image fails with a dataset error.

  Whisp only rebuilds images it built itself, as it can't know what a passed-in
  image contains.

  Args:
    error: The underlying exception from Earth Engine.

  Returns:
    RuntimeError: Descriptive error explaining how to recover.
  """
  return RuntimeError(
      "Earth Engine failed on the whisp_image you passed in, with what looks"
      f" like a broken or missing dataset: {str(error)[:300]}\nWhisp only"
      " rebuilds images it builds itself, as it can't know what a passed-in"
      " image contains. Rebuild the image now with"
      " combine_datasets(national_codes=..., auto_recovery=True), which leaves"
      " out broken datasets, add any custom bands again and rerun, or leave"
      " out whisp_image so Whisp builds and recovers the image itself (do this"
      " if a rebuilt image still fails, as some errors only show when pixels"
      " are computed, which only Whisp's own recovery checks). If you keep the"
      " image between runs (e.g. a cached copy), rebuild that copy too."
  )


def list_functions(national_codes=None):
  """Returns dataset preparation functions matching global or national prefixes.

  Includes functions that end with "_prep" and either:
  - Start with "g_" (global/regional products, excluding context bands)
  - Start with any provided national code prefix (nXX_)

  Context band functions (g_gaul_admin_code, g_water_mask_prep) are handled
  separately and excluded from this list to avoid duplication.

  Args:
    national_codes: List of ISO2 country codes (without the 'n' prefix).

  Returns:
    list[Callable[[], ee.Image]]: Matching dataset preparation functions.
  """
  # Use the module's globals to get all defined functions
  current_module = inspect.getmodule(inspect.currentframe())

  # If national_codes is None, default to an empty list
  if national_codes is None:
    national_codes = []

  # Context band functions that are handled separately
  context_functions = {"g_gaul_admin_code", "g_water_mask_prep"}

  # Create prefixes tuple with proper formatting ('n' + code + '_')
  allowed_prefixes = ("g_",) + tuple(
      f"n{code.lower()}_" for code in national_codes
  )

  # Filter functions in a single pass, excluding context band functions
  functions = [
      func
      for name, func in inspect.getmembers(current_module, inspect.isfunction)
      if name.endswith("_prep")
      and name.startswith(allowed_prefixes)
      and name not in context_functions
  ]

  return functions


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
