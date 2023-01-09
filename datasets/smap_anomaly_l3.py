"""SMAP L3 daily anomaly.

Code by Karyn Tabor (NASA).

This code calculates a normalized anomaly with SMAP L3 AM and PM data
1. Calculate the climatology by averaging 31 days of SMAP L3 daily
   composite data over every year in the record. The 31-day window is
   centered around day t. t is the current day-15.
2. Create QA mask
3. Subtract the climatology from the current average to get the anomaly
4. Divide the anomaly by the climatology to normalize the data
5. Apply QA mask to normalized anomaly
"""

import datetime
import pytz

import ee

SMAPL3 = ee.ImageCollection('NASA/SMAP/SPL3SMP_E/005_RAW')

# getting today's date minus three days (3 days ago for processing lag)
anomalydate = ee.Date(datetime.datetime.now(pytz.UTC)).advance(
    -3, 'day').format('YYYY-MM-DD')
anomalymonth = ee.Number.parse(
    ee.Date(datetime.datetime.now(pytz.UTC)).advance(-3, 'day').format('M'))
anomalyday = ee.Number.parse(
    ee.Date(datetime.datetime.now(pytz.UTC)).advance(-3, 'day').format('d'))

# create list of years to calculate climatology
startyear = 2015  # first year of SMAP data
currentyear = ee.Number.parse(
    ee.Date(datetime.datetime.now(pytz.UTC)).advance(-3, 'day').format('YYYY'))
years = ee.List.sequence(2015, currentyear)

# select SM for current day
currentdaySM = SMAPL3.filter(ee.Filter.date(anomalydate))

soilmoisture_AM = currentdaySM.select('soil_moisture_am').toBands()
soilmoisture_PM = currentdaySM.select('soil_moisture_pm').toBands()

# select QA values
soilmoisture_AM_qamask = currentdaySM.select('retrieval_qual_flag_am').toBands()
soilmoisture_PM_qamask = currentdaySM.select('retrieval_qual_flag_pm').toBands()

# invert QA values to create mask
QA_AM_mask = soilmoisture_AM_qamask.eq(0)
QA_PM_mask = soilmoisture_PM_qamask.eq(0)


# create climatologies
# function calculating image of climatology means for AM
def am_clim(year):
  date_object = ee.Date.fromYMD(year, anomalymonth, anomalyday)
  begindate = ee.Date(date_object).advance(-15, 'day')
  enddate = ee.Date(date_object).advance(+15, 'day')
  annual = (
      SMAPL3.filter(ee.Filter.date(begindate,
                                   enddate)).select('soil_moisture_am').mean())
  return (annual.set('year', year).set('system:time_start',
                                       ee.Date.fromYMD(year, 1, 1)))


annualSM_AM = ee.ImageCollection.fromImages([am_clim(year) for year in years])

# calculate average of all years
climSM_AM = annualSM_AM.toBands().reduce(ee.Reducer.mean())


# repeat above function for PM
def pm_clim(year):
  date_object = ee.Date.fromYMD(year, anomalymonth, anomalyday)
  begindate = ee.Date(date_object).advance(-15, 'day')
  enddate = ee.Date(date_object).advance(+15, 'day')
  annual = (
      SMAPL3.filter(ee.Filter.date(begindate,
                                   enddate)).select('soil_moisture_pm').mean())
  return annual


annualSM_PM = ee.ImageCollection.fromImages([pm_clim(year) for year in years])

# calculate average of all years
climSM_PM = annualSM_PM.toBands().reduce(ee.Reducer.mean())

# calculate anomaly
SM_anomaly_AM = soilmoisture_AM.subtract(climSM_AM)
SM_anomaly_PM = soilmoisture_PM.subtract(climSM_PM)

SM_anomaly_AM_normalized = SM_anomaly_AM.divide(climSM_AM)
SM_anomaly_PM_normalized = SM_anomaly_PM.divide(climSM_PM)

# apply QA mask
SM_anomaly_AM_masked = SM_anomaly_AM_normalized.updateMask(QA_AM_mask)
SM_anomaly_PM_masked = SM_anomaly_PM_normalized.updateMask(QA_PM_mask)
