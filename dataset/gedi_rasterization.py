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

import ee
import json
import os
import datetime
import time
from ee.batch import Export
import ast

def make_timestampFromYMD(year, month, day):
    tdat = datetime.datetime(year, month, day)
    return time.mktime(tdat.timetuple()) * 1000

def rasterize_GEDI_by_utm_zone(orbits, grid_id, month):
    props = ["orbit", "track", "beam", "channel", "degrade", "dtime", "quality",
             "rx_algrunflag", "rx_quality", "sensitivity", "toploc", "zcross",
             "rh10", "rh20", "rh30", "rh40", "rh50", "rh60", "rh70", "rh80", "rh90", "rh98"]

    def updateOrbit(f):
        return (f.set('orbit', fshots.get('orbit'))
                 .set('track', fshots.get('track'))
                )

    shots = []
    for orbit in orbits:
        fshots = ee.FeatureCollection(orbit).filterMetadata('quality', 'equals', 1)
        augmented = fshots.map(updateOrbit)
        shots.append(augmented)

    shots = ee.FeatureCollection(shots).flatten()

    grid = (ee.FeatureCollection("users/yang/GEETables/GEDI/GEDI_UTM_GRIDS_LandOnly")
              .filterMetadata('grid_id', 'equals', grid_id))

    zone_id = ee.Feature(grid.first()).get('grid_name').getInfo()
    crs = ee.Feature(grid.first()).get('crs').getInfo()

    iprop = {
        "month": month,
        "year": 2019,
        "grid_id": grid_id,
        "version": 1,
        "system:time_start": make_timestampFromYMD(2019, month, 15)
    }

    img = (shots.sort('sensitivity', False)
           .reduceToImage(props, ee.Reducer.first().forEach(props))
           .reproject(crs, None, 25)
           .set(iprop))

    asset_dir = "projects/gee-gedi/assets/L2A_Raster"
    task_name = f'L2A_Grid{grid_id:03d}_{zone_id}_2019_{month:02d}_20200625'

    box = grid.geometry().buffer(2500, 25).bounds()
    task = Export.image.toAsset(
        image=img.clip(box),
        description=task_name,
        assetId=f"{asset_dir}/{task_name}",
        region=box,
        pyramidingPolicy={".default": 'sample'},
        scale=25,
        crs=crs,
        maxPixels=1e13)

    time.sleep(0.1)
    task.start()

lookup_file = 'L2A_lookup.txt'
with open(lookup_file) as infh:
    all = infh.readlines()
    strdict = ''.join(all)
    lookup = ast.literal_eval(strdict)

months = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
}

def runMain():
    start_id = 1 #UTM grid id
    count = 389 # total of UTM grids
    ee.Initialize()

    for grid_id in range(start_id, start_id + count):
        for k, v in lookup.items():
            if k != 'May':
                continue

            print(grid_id, k, '-->', months[k])
            rasterize_GEDI_by_utm_zone(v, grid_id, months[k])


runMain()
