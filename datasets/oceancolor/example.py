# Copyright 2021 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
import warnings
from datetime import datetime

import numpy as np
from dateutil.parser import parse

from swathutils import (
    write_tif,
    gdal_translate,
    create_dataset,
    swath_resample,
    flags_band,
    get_keys
)


def swath_pyresample_gdaltrans(file: str, var: str, subarea: dict, epsilon: float, src_tif: str, dst_tif: str):
    """Reprojects swath data using pyresample and translates the image to EE ready tif using gdal

    Parameters
    ----------
    file: str
        file to be resampled and uploaded to GC -> EE
    var: str
        input variable name
    subarea: dict
        string name of the projection to resample the data onto (pyproj supported)
    epsilon: float
        The distance to a found value is guaranteed to be no further than (1 + eps)
        times the distance to the correct neighbour. Allowing for uncertainty decreases execution time.
    src_tif: str
        temporary target geotif file
    dst_tif: str
        final geotif output, GDAL processed

    Returns
    -------
        dict:
            global and var attributes
    """

    # -----------
    # get dataset
    # -----------
    resample_dst = create_dataset(file=file, key=var, subarea=subarea)
    resample_dst['epsilon'] = epsilon

    # ---------------
    # resample swaths
    # ---------------
    if var in ('l2_flags', 'QA_flag'):
        meta = flags_band(dataset=resample_dst,
                          key=var,
                          src_tif=src_tif,
                          dst_tif=dst_tif)

    else:
        attrs = resample_dst.pop(var)
        glob_attrs = resample_dst.pop('glob_attrs')
        proj = resample_dst.pop('proj')
        fill_value = attrs['_FillValue']

        result = swath_resample(swath=resample_dst, trg_proj=proj)
        np.ma.set_fill_value(result, fill_value=fill_value)

        # ---------------------
        # write out the g-tif-f
        # ---------------------
        meta = write_tif(file=src_tif,
                         dataset=result,
                         data_type='Float32',
                         metadata={var: attrs, 'glob_attrs': glob_attrs},
                         area_def=proj)

        gdal_translate(src_tif=src_tif,
                       dst_tif=dst_tif,
                       ot='Float32',
                       nodata=fill_value)

    return meta


if __name__ == '__main__':
    warnings.filterwarnings('ignore')

    # testing with AQUA and SGLI
    # ---------
    # Constants
    # ---------
    BOUNDS = 117, 145, 25, 52
    PROJ_ID = 'laea'  # 'eqc', 'cea', 'laea', 'lonlat
    X0, X1, Y0, Y1 = BOUNDS
    PILOT_AREA = {'x0': X0, 'y0': Y0,
                  'x1': X1, 'y1': Y1,
                  'area_id': 'granule',
                  'proj_id': PROJ_ID,
                  'area_name': 'nw_granule'}

    HOME = os.getcwd()
    CWDIR = f'{HOME}/Results'
    if not os.path.isdir(CWDIR):
        os.makedirs(CWDIR)

    LOGDIR = f'{HOME}/eeupload_logs'
    if not os.path.isdir(LOGDIR):
        os.makedirs(LOGDIR)

    EPSILON = 0.3
    BUCKET = 'gs://<bucket>'
    ASSET_ID = '<full-path-to-ee-asset>'

    # date = datetime(2006, 5, 3)
    # S2006123032429.L2_MLAC_OC.nc
    # GC1SG1_202105060128H05210_L2SG_NWLRQ_2001.h5
    # GC1SG1_202004140218J06809_L2SG_IWPRQ_2000.h5
    test_file = r'GC1SG1_202004140218J06809_L2SG_IWPRQ_2000.h5',

    # # --------------
    # # download swath
    # # --------------
    # cmd = [f"python {HOME}/pymodules/getfile.py",
    #        f"--sat=sgli", "--data_type=rrs",
    #        f"--stime={date.strftime('%Y-%m-%d')}T00:00:00Z",
    #        f"--etime={date.strftime('%Y-%m-%d')}T23:59:59Z",
    #        f"--slat={BOUNDS[-2]}",
    #        f"--elat={BOUNDS[-1]}",
    #        f"--slon={BOUNDS[0]}",
    #        f"--elon={BOUNDS[1]}",
    #        f"--get_data={HOME}/data"]
    # os.system(' '.join(cmd))

    for fi, sat in zip(test_file, ('sgli',)):

        l2_key = ['QA_flag'] if sat == 'sgli' else ['l2_flags']
        keys = get_keys(file=fi) + l2_key

        for key in keys:

            if key in ('CDOM', 'TSM',):
                continue
            # ----------
            # Processing
            # ----------
            log = f'{LOGDIR}/ee.tasks.{sat}'

            with open(log, 'a') as txt:

                bsn = os.path.basename(fi)
                print(f'{key}: {bsn}')
                tempdir = os.path.abspath(f"{CWDIR}/{bsn.split('.')[0]}")
                bsn = bsn.replace(".nc", ".tif").replace(".h5", ".tif")
                src_file = os.path.abspath(f'{tempdir}/{bsn}')
                trg_file = f"{src_file.split('.')[0]}_{key}.tif"

                if not os.path.isdir(tempdir):
                    os.makedirs(tempdir)

                # --------------
                # swath resample
                # --------------
                attributes = swath_pyresample_gdaltrans(
                    file=fi,
                    src_tif=src_file,
                    dst_tif=trg_file,
                    var=key,
                    subarea=PILOT_AREA,
                    epsilon=EPSILON)

                # # ------------
                # # Upload to GC
                # # ------------
                # uir, ext = gcutil.upload(file=trg_file, bucket=BUCKET)

                bsn_tif = os.path.basename(trg_file)
                uir = f'{BUCKET}/{bsn_tif}'

                # ------------
                # Upload to EE
                # ------------
                # To keep variable names consistent across different sensors
                var_name = 'chlor_a' if key in ('chlor_a', 'CHLA') \
                    else 'l2_flags' if key in ('l2_flags', 'QA_flag') \
                    else key.replace('NWLR', 'Rrs')

                if sat == 'sgli':
                    start = parse(attributes.pop("Scene_start_time"))
                    end = parse(attributes.pop("Scene_end_time"))
                else:
                    start = parse(attributes.pop("time_coverage_start"))
                    end = parse(attributes.pop("time_coverage_end"))

                # missing_value = attributes.pop('_FillValue')
                # task_id = eeutil.upload(
                #     asset_id=ASSET_ID, missing_data=missing_value,
                #     var=var_name, src_file=uir, attributes=attributes,
                #     start_time=start, end_time=end)
                #
                # # # ------------
                # # # Update log-f
                # # # ------------
                # # txt.write(f'{bsn_tif}|{task_id}\n')
