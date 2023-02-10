"""SMAP L4 anomaly.

Code by Karyn Tabor (NASA).

This code calculates a normalized anomaly with SMAP L4 data
1. Calculate the climatology by averaging 31 days of SMAP L4 daily
   data over every year in the record. The 31-day window is
   centered around day t. t is the current day-15.
2. Subtract the climatology from the current average to get the anomaly
"""

import datetime
import ee


# pytype:disable=attribute-error

def anomaly(image):
  SMAPL4 = ee.ImageCollection('NASA/SMAP/SPL4SMGP/007_RAW')
  current_date = ee.Date(datetime.datetime.now())
  image_date = ee.Date(image.get('system:time_start'))

  # create list of years to calculate climatology
  start_year = 2015  # first year of SMAP data
  current_year = current_date.get('year')
  image_year = image_date.get('year')
  years = ee.List.sequence(start_year, current_year).remove(image_year)

  soilmoisture = image.select('sm_surface')

  # create climatologies
  # function calculating image of climatology means
  def clim(year):
    date_object = image_date.update(year=year)
    begindate = ee.Date(date_object).advance(-15, 'day')
    enddate = ee.Date(date_object).advance(+16, 'day')
    annual = SMAPL4.filter(ee.Filter.date(
        begindate, enddate)).select('sm_surface').mean()
    return annual.rename('soil_moisture_anomaly_15d')

  annualSM = ee.ImageCollection.fromImages(years.map(clim))

  # calculate average of all years
  climSM = annualSM.toBands().reduce(ee.Reducer.mean())

  # calculate anomaly
  SM_anomaly = soilmoisture.subtract(climSM).rename(
      'sm_surface_anomaly')

  return SM_anomaly


def apply(image):
  computed_anomaly = anomaly(image)
  return image.addBands([computed_anomaly])
