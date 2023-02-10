"""SMAP L3 daily anomaly.

Code by Karyn Tabor (NASA).

This code calculates a normalized anomaly with SMAP L3 AM and PM data
1. Calculate the climatology by averaging 31 days of SMAP L3 daily
   composite data over every year in the record. The 31-day window is
   centered around day t. t is the current day-15.
2. Create QA mask
3. Subtract the climatology from the current average to get the anomaly
4. Apply QA mask to the anomaly
"""

import datetime
import ee


# pytype:disable=attribute-error

def anomaly(image):
  SMAPL3 = ee.ImageCollection('NASA/SMAP/SPL3SMP_E/005_RAW')
  current_date = ee.Date(datetime.datetime.now())
  image_date = ee.Date(image.get('system:time_start'))

  # create list of years to calculate climatology
  start_year = 2015  # first year of SMAP data
  current_year = current_date.get('year')
  image_year = image_date.get('year')
  years = ee.List.sequence(start_year, current_year).remove(image_year)

  soilmoisture_AM = image.select('soil_moisture_am')
  soilmoisture_PM = image.select('soil_moisture_pm')

  # select QA values
  soilmoisture_AM_qamask = image.select('retrieval_qual_flag_am')
  soilmoisture_PM_qamask = image.select('retrieval_qual_flag_pm')

  # invert QA values to create mask
  QA_AM_mask = soilmoisture_AM_qamask.eq(0)
  QA_PM_mask = soilmoisture_PM_qamask.eq(0)

  # create climatologies
  # function calculating image of climatology means for AM
  def am_clim(year):
    date_object = image_date.update(year=year)
    begindate = ee.Date(date_object).advance(-15, 'day')
    enddate = ee.Date(date_object).advance(+16, 'day')
    annual = SMAPL3.filter(ee.Filter.date(
        begindate, enddate)).select('soil_moisture_am').mean()
    return annual.rename('soil_moisture_am_anomaly_15d')

  annualSM_AM = ee.ImageCollection.fromImages(years.map(am_clim))

  # calculate average of all years
  climSM_AM = annualSM_AM.toBands().reduce(ee.Reducer.mean())

  # repeat above function for PM
  def pm_clim(year):
    date_object = image_date.update(year=year)
    begindate = ee.Date(date_object).advance(-15, 'day')
    enddate = ee.Date(date_object).advance(+15, 'day')
    annual = SMAPL3.filter(ee.Filter.date(
        begindate, enddate)).select('soil_moisture_pm').mean()
    return annual.rename('soil_moisture_pm_anomaly_15d')

  annualSM_PM = ee.ImageCollection.fromImages(years.map(pm_clim))

  # calculate average of all years
  climSM_PM = annualSM_PM.toBands().reduce(ee.Reducer.mean())

  # calculate anomaly
  SM_anomaly_AM = soilmoisture_AM.subtract(climSM_AM).rename(
      'soil_moisture_am_anomaly')
  SM_anomaly_PM = soilmoisture_PM.subtract(climSM_PM).rename(
      'soil_moisture_pm_anomaly')

  # apply QA mask
  SM_anomaly_AM_masked = SM_anomaly_AM.updateMask(QA_AM_mask)
  SM_anomaly_PM_masked = SM_anomaly_PM.updateMask(QA_PM_mask)

  return SM_anomaly_AM_masked, SM_anomaly_PM_masked


def apply(image):
  am, pm = anomaly(image)
  return image.addBands([am, pm])
