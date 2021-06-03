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
import re
import subprocess
import warnings

import h5py
import numpy as np
import pyproj
from netCDF4 import Dataset
from osgeo import (gdal, osr)
from pyresample import (AreaDefinition, SwathDefinition)
from pyresample.kd_tree import resample_nearest


def get_keys(file: str):
    """Gets the key (variable) names from level-2 data which are found in geophysical_data group
    in NASA netCDF data files and Image in JAXA hdf5 data files.

    Parameters
    ----------
    file: str
        file name of the netCDF/hdf5 from which to get the key names

    Returns
    -------
        list
            A list of geophysical variables found in file containing Rrs and chlor_a
    """

    if file.endswith('.nc'):
        with Dataset(file, 'r') as nc:
            keys = [key for key in nc.groups['geophysical_data'].variables.keys()
                    if ('Rrs' in key) or ('chl' in key)]
            return keys

    if file.endswith('.h5'):
        exclude = ['Cloud_probability', 'Line_tai93', 'QA_flag', 'TAUA_670', 'TAUA_865']
        with h5py.File(file, 'r') as dst:
            keys = list(dst[f'/Image_data/'].keys())
        return [key for key in keys if key not in exclude]


def get_attrs(file: str, loc=None, flag: str = 'nc'):
    """Gets the key data from file
    return masked array with geophysical data

    Parameters
    ----------
    file: str
        file name to read
    loc: Dataset
        pointer of the data where to be read in the attrs
    flag: str
        whether the pointer is from Dataset or h5py

    Returns
    -------
        dict:
            attributes: global or loc attributes
    """

    if flag == 'nc':
        if loc is None:
            with Dataset(file, 'r') as nc:
                attrs = {attr: nc.getncattr(attr)
                         for attr in nc.ncattrs()}
            return attrs
        attrs = {attr: loc.getncattr(attr)
                 for attr in loc.ncattrs()}
        if 'flag_meanings' in attrs.keys():
            attrs['_FillValue'] = np.int32(-1 << 31)
        return attrs

    if flag == 'h5':
        dtype = (bytes, np.bytes_)

        exclude = 'Dim0', 'Dim1'

        def decode(at):
            if type(at) in dtype:
                return at.decode()
            return at

        if loc is None:
            with h5py.File(file, 'r') as h5:
                attrs = dict(h5['/Global_attributes'].attrs)
        else:
            attrs = dict(loc)

        return {key: decode(at=val[0])
                for key, val in attrs.items()
                if key not in exclude}


def get_bounds(file: str):
    """Gets the file geospatial boundaries

    Parameters
    ----------
    file: str
       source file to extract geolocation information

    Returns
    -------
        tuple
            (x0, x1, y0, y1): geospatial limits of the image
    """
    if file.endswith('.nc'):
        with Dataset(file, 'r') as nc:
            x0 = (min(nc.geospatial_lon_min,
                      nc.westernmost_longitude))
            x1 = (max(nc.geospatial_lon_max,
                      nc.easternmost_longitude))

            y0 = (min(nc.geospatial_lat_min,
                      nc.southernmost_latitude))
            y1 = (max(nc.geospatial_lat_max,
                      nc.northernmost_latitude))
        return x0, x1, y0, y1

    if file.endswith('.h5'):
        lat = get_geo(file=file, key='Latitude')
        lon = get_geo(file=file, key='Longitude')
        return lon.min(), lon.max(), lat.min(), lat.max()


def geo_interp(src_geo: np.array, interval: int):
    """Bilinear interpolation of SGLI geo-location corners to a spatial grid
    Code obtained from the GCOM-C PI kick-off meeting 201908
        sample_p3.py: Sample Code of the Practice 5
        Author: K. Ogata
        License: MIT

    Parameters
    ----------
    src_geo: np.array
        either lon or lat
    interval: int
        resampling interval in pixels

    Return
    ------
        np.array
            2-D array
    """

    sds = np.concatenate((src_geo, src_geo[-1].reshape(1, -1)), axis=0)
    sds = np.concatenate((sds, sds[:, -1].reshape(-1, 1)), axis=1)

    ratio_0 = np.tile(
        np.linspace(0, (interval - 1) / interval, interval, dtype=np.float32),
        (sds.shape[0] * interval, sds.shape[1] - 1))

    ratio_1 = np.tile(
        np.linspace(0, (interval - 1) / interval, interval, dtype=np.float32).reshape(-1, 1),
        (sds.shape[0] - 1, (sds.shape[1] - 1) * interval))

    sds = np.repeat(sds, interval, axis=0)
    sds = np.repeat(sds, interval, axis=1)
    interp = (1. - ratio_0) * sds[:, :-interval] + ratio_0 * sds[:, interval:]
    return (1. - ratio_1) * interp[:-interval, :] + ratio_1 * interp[interval:, :]


def get_geo(file: str, key: str):
    """Navigation Data of the SGLI
    Parts of the code obtained from the GCOM-C PI kick-off meeting 201908
        Author: K. Ogata
        License: MIT

    Parameters
    ----------
    file: str
        full filename
    key: str
        Either Longitude or Latitude

    Return
    ------
        np.array
            2-D array with dims == to geophysical variables
    """

    with h5py.File(file, 'r') as h5:
        nsl = h5['/Image_data'].attrs['Number_of_lines'][0]
        psl = h5['/Image_data'].attrs['Number_of_pixels'][0]
        img_size = (slice(0, nsl), slice(0, psl))

        data = h5[f'Geometry_data/{key}'][:]
        attrs = dict(h5[f'Geometry_data/{key}'].attrs)

        if 'Error_DN' in attrs.keys():
            data[data == attrs.pop('Error_DN')[0]] = np.NaN

        if ('Minimum_valid_DN' in attrs.keys()) and \
                ('Maximum_valid_DN' in attrs.keys()):
            valid_min = attrs.pop('Minimum_valid_DN')[0]
            valid_max = attrs.pop('Maximum_valid_DN')[0]
            data[(data < valid_min) | (data > valid_max)] = np.NaN

        # Convert DN to PV
        if ('Slope' in attrs.keys()) and ('Offset' in attrs.keys()):
            data = data * attrs.pop('Slope')[0] + attrs.pop('Offset')[0]

        if ('Minimum_valid_value' in attrs.keys()) and \
                ('Maximum_valid_value' in attrs.keys()):
            valid_min = attrs.pop('Minimum_valid_value')[0]
            valid_max = attrs.pop('Maximum_valid_value')[0]
            data[(data < valid_min) | (data > valid_max)] = np.NaN

        # Longitude
        is_stride_180 = False
        if key == 'Longitude':
            if np.abs(np.nanmin(data) - np.nanmax(data)) > 180.:
                is_stride_180 = True
            data[data < 0] = 360. + data[data < 0]

        interval = h5[f'/Geometry_data/{key}'].attrs['Resampling_interval'][0]
        sds = geo_interp(src_geo=data, interval=interval)[img_size]

    if is_stride_180:
        sds[sds > 180.] = sds[sds > 180.] - 360.
    return sds


def get_data(file: str, key: str):
    """Gets the key data from file
    return masked array with geophysical data

    Parameters
    ----------
    file: str
        file name to read
    key: str
        pointer of the data to be read in the file

    Returns
    -------
        dict:
            data: geophysical data masked_array
            attributes: key and global attributes
    """

    if file.endswith('.nc'):
        with Dataset(file, 'r') as nc:
            if key in ('longitude', 'latitude'):
                sid = nc.groups['navigation_data']
            else:
                sid = nc.groups['geophysical_data']

            sds = {**{key: sid[key][:]},
                   **get_attrs(file=file, loc=sid[key])}
        return sds

    if file.endswith('.h5'):
        with h5py.File(file, 'r') as h5:
            if key in ('Longitude', 'Latitude'):
                sid = get_geo(file=file, key=key)
                attrs = get_attrs(file=file, flag='h5', loc=h5[f'Geometry_data/{key}'].attrs)
                sds = {**{key: sid}, **attrs}

            elif key == 'QA_flag':
                attrs = get_attrs(file=file, flag='h5', loc=h5[f'Image_data/{key}'].attrs)
                sdn = h5[f'Image_data/{key}'][:]
                attrs['_FillValue'] = attrs['Error_DN']
                sds = {**{key: sdn}, **attrs}

            else:
                fill_value = np.float32(-32767)
                attrs = dict(h5[f'Image_data/{key}'].attrs)
                sdn = h5[f'Image_data/{key}'][:]

                mask = np.bool_(np.zeros(sdn.shape))
                if 'Error_DN' in attrs.keys():
                    mask = mask | np.where(np.equal(sdn, attrs.pop('Error_DN')[0]), True, False)
                if 'Land_DN' in attrs.keys():
                    mask = mask | np.where(np.equal(sdn, attrs.pop('Land_DN')[0]), True, False)
                if 'Cloud_error_DN' in attrs.keys():
                    mask = mask | np.where(np.equal(sdn, attrs.pop('Cloud_error_DN')[0]), True, False)
                if 'Retrieval_error_DN' in attrs.keys():
                    mask = mask | np.where(np.equal(sdn, attrs.pop('Retrieval_error_DN')[0]), True, False)
                if ('Minimum_valid_DN' in attrs.keys()) and ('Maximum_valid_DN' in attrs.keys()):
                    mask = mask | np.where((sdn < attrs.pop('Minimum_valid_DN')) |
                                           (sdn > attrs.pop('Maximum_valid_DN')), True, False)

                # Convert DN to PV
                slope, offset = 1, 0
                if 'NWLR' in key:
                    if ('Rrs_slope' in attrs.keys()) and \
                            ('Rrs_slope' in attrs.keys()):
                        slope = attrs.pop('Rrs_slope')[0]
                        offset = attrs.pop('Rrs_offset')[0]
                else:
                    if ('Slope' in attrs.keys()) and \
                            ('Offset' in attrs.keys()):
                        slope = attrs.pop('Slope')[0]
                        offset = attrs.pop('Offset')[0]

                sds = sdn * slope + offset
                sds[mask] = fill_value
                attrs = get_attrs(file=file, flag='h5', loc=h5[f'Image_data/{key}'].attrs)
                attrs['_FillValue'] = fill_value
                sds = {**{key: np.ma.masked_where(mask, sds).astype(np.float32)}, **attrs}
        return sds


def create_dataset(file: str, key: str, subarea: dict):
    """Constructs a dataset for a given key

    Parameters
    ----------
    file: str
        file name to read
    key: str
        variable name
    subarea: dict
        area definition for pyresample

    Returns
    -------
        dict:
            data: geophysical data masked_array
            attributes: key and global attributes
            proj: AreaDefinition
    """

    dataset = get_data(file=file, key=key)
    data = dataset.pop(key)
    fill_value = dataset['_FillValue']
    dataset = {key: dataset}
    data = np.ma.dstack((data,))
    np.ma.set_fill_value(data, fill_value=fill_value)
    dataset.update({'channels': data})

    # -----------------
    # Global attributes
    # -----------------
    glob_attrs = get_attrs(file=file, flag=file[-2:])

    # ------------------
    # spatial resolution
    # ------------------
    if file.endswith('.h5'):
        glob_attrs['spatialResolution'] = '250 m'
    sr = glob_attrs['spatialResolution']
    unit = ''.join(re.findall('[a-z]', sr, re.IGNORECASE))
    sr = float(sr.strip(unit))
    if unit.lower() == 'km':
        sr *= 1000

    # -----------------------
    # pyresample --> proj map
    # -----------------------
    proj = get_adef(pixel_resolution=sr, subarea=subarea)
    dataset.update({'glob_attrs': fix_bounds(metadata=glob_attrs, proj=proj),
                    'radius_of_influence': sr, 'proj': proj})

    # ---------------------
    # swath geoloc lon/lat
    # ---------------------
    keys = ('Longitude', 'Latitude') \
        if file.endswith('.h5') \
        else ('longitude', 'latitude')

    for loc in keys:
        out = get_data(file=file, key=loc)
        dataset.update({loc.lower(): out.pop(loc)})

    return dataset


def get_adef(pixel_resolution: float, subarea: dict):
    """Generates the grid projection for mapping L2 data based on input data resolution.
    If lonlat griding scheme is used, the grid resolution will be exact at the centre

    Parameters
    ----------
    pixel_resolution: float
       swath pixel resolution in metres
    subarea:  dict
        subarea dictionary with keys
        x0 float: longitude (deg E) of the lower left corner
        y0 float: latitude (deg N)  of the lower left corner
        x1 float: longitude (deg E) of the upper right corner
        y1 float: latitude (deg N)  of the upper right corner
        area_id str: string with subarea id
        area_name: string name of the subarea
        proj_id: string name of the projection being used (any recognised by pyproj)

    Returns
    -------
    AreaDefinition: AreaDefinition
       area definition with pyproj information embedded
    """
    # --------------
    # subarea limits (box)
    # --------------
    lon_box = subarea['x0'], subarea['x1']
    lat_box = subarea['y0'], subarea['y1']
    lon_0 = np.array(lon_box).mean()
    lat_0 = np.array(lat_box).mean()

    # ---------------
    # proj parameters
    # ---------------
    datum = 'WGS84'
    proj_id = subarea['proj_id']
    area_id = subarea['area_id']
    area_name = subarea['area_name']

    # -----------
    # pyproj proj
    # -----------
    area_dict = dict(datum=datum, lat_0=lat_0, lon_0=lon_0, proj=proj_id, units='m')
    proj = pyproj.Proj(area_dict)

    if proj_id in ('lonlat', 'longlat'):
        g = pyproj.Geod(ellps=datum)
        # define Pixel height width based on meter resolution, keeping 7 decimals, < 1 m
        # L = 2・pi・r・A / 360
        x_pixel_size = round((pixel_resolution * 360.) / (2. * np.pi * g.a * np.cos(np.deg2rad(lat_0))) * 1e7) / 1e7
        y_pixel_size = round((pixel_resolution * 360.) / (2. * np.pi * g.b) * 1e7) / 1e7

        x = np.arange(lon_box[0], lon_box[1], x_pixel_size, np.float32)
        y = np.arange(lat_box[1], lat_box[0], -y_pixel_size, np.float32)

    else:
        # use proj to get granule corners
        # -------------------------------
        x, y = proj(lon_box, lat_box)
        x_pixel_size = y_pixel_size = pixel_resolution
    min_x, max_x = np.min(x), np.max(x)
    min_y, max_y = np.min(y), np.max(y)

    # -----------
    # area extent
    # -----------
    area_extent = min_x, min_y, max_x, max_y
    x_size = int((area_extent[2] - area_extent[0]) / x_pixel_size)
    y_size = int((area_extent[3] - area_extent[1]) / y_pixel_size)

    # ---------------
    # area definition
    # ---------------
    return AreaDefinition(
        area_id, area_name, proj, area_dict,
        x_size, y_size, area_extent
    )


def fix_bounds(metadata: dict, proj: AreaDefinition):
    """updates the global attributes with information of the new resampling grid

    Parameters
    ----------
    metadata: dict
       target filename to save the tiff file
    proj: AreaDefinition
       AreaDefinition with grid resampling information

    Returns
    -------
    attrs: dict
       Attributes with geospatial information updated to new grid
    """

    lon, lat = proj.get_lonlats()
    metadata['geospatial_lat_min'] = lon.min()
    metadata['geospatial_lat_max'] = lon.max()
    metadata['geospatial_lon_min'] = lat.min()
    metadata['geospatial_lon_max'] = lat.max()

    if 'start_center_longitude' in metadata.keys():
        metadata.pop('start_center_longitude')
    if 'start_center_latitude' in metadata.keys():
        metadata.pop('start_center_latitude')
    if 'end_center_longitude' in metadata.keys():
        metadata.pop('end_center_longitude')
    if 'end_center_latitude' in metadata.keys():
        metadata.pop('end_center_latitude')

    metadata['center_longitude'] = lon[0, :].mean()
    metadata['center_latitude'] = lat[:, 0].mean()

    metadata['northernmost_latitude'] = lat.max()
    metadata['southernmost_latitude'] = lat.min()
    metadata['easternmost_longitude'] = lon.max()
    metadata['westernmost_longitude'] = lon.min()

    return metadata


def split_flags(data: np.ndarray, flag_names: list):
    """separated the single ndarray l2_flags info into components of 16 or 32bits

    Parameters
    ----------
    data: ndarray
        level 2 flags to be split into different bands
    flag_names: list
        list of flag names in order of 16 or 32 bits. Skip SPARE flags

    Returns
    -------
        tuple
            data and the bands (bits) separated into a new ma.dstack array
    """
    sds, bits = [], []
    append = sds.append
    bit_apn = bits.append
    # print(data.dtype)

    # -- dis --
    for i, flag in enumerate(flag_names):
        bit_apn(i)
        shift = 1 << i
        flag_bit = shift & data
        # print(f'{i:02}: {flag:>10}: {flag_bit.min():2} | {flag_bit.max():>10}')
        append(flag_bit)
    return np.ma.dstack(sds), bits


def flags_band(dataset: dict, key: str, src_tif: str, dst_tif: str):
    """Get the file geospatial boundaries

    Parameters
    ----------
    dataset: str
       dataset with attributes, proj, etc
    key: str
       variable name
    src_tif: str
       source file being reprojected
    dst_tif: str
       target file after reprojected

    Returns
    -------
          dict
            dataset attributes
    """

    attrs = dataset.pop(key)
    glob_attrs = dataset.pop('glob_attrs')
    proj = dataset.pop('proj')
    fill_value = attrs['_FillValue']

    # --------------------------------
    # resample l2_flags --> split/join
    # --------------------------------
    if key == 'QA_flag':
        def flag_meaning(flag: str, i: int):
            start = len(f'Bit-{i}) ')
            end = flag.index(': ')
            return flag[start:end]

        flag_meanings = [flag_meaning(flag=flag, i=i)
                         for i, flag in enumerate(attrs.pop('Data_description').split('\n'))
                         if len(flag) > 0]
        attrs['flag_meanings'] = ' '.join(flag_meanings)

    # -- split --
    sds, bits = split_flags(
        data=dataset['channels'],
        flag_names=attrs['flag_meanings'].split())
    dataset.update({'channels': sds})

    # -- resample --
    result = swath_resample(swath=dataset, trg_proj=proj)
    np.ma.set_fill_value(result, fill_value=fill_value)

    # -- temp geotif --
    meta, sds, mask, fill_value = {}, 0, False, 0
    temp = dst_tif.replace('.tif', '_temp.tif')
    for i, bit in enumerate(bits):
        meta = write_tif(file=src_tif,
                         dataset=result[:, :, i],
                         data_type='Int32',
                         metadata={key: attrs, 'glob_attrs': glob_attrs},
                         area_def=proj)

        # -- warp/translate --
        gdal_translate(src_tif=src_tif, dst_tif=temp, nodata=fill_value, ot='Int32')

        dst = gdal.Open(temp, gdal.GA_ReadOnly)
        band = dst.GetRasterBand(1)
        arr = band.ReadAsArray()
        fill_value = int(band.GetMetadata()['_FillValue'])

        shift = 1 << i
        sds += shift * (shift & arr > 0)
        # print(f'{bit:02}: {sds[~mask].min():>10} | {sds[~mask].max():>10}')
        mask = mask & np.ma.masked_where(arr == fill_value, arr).mask

        dst = None

    sds = np.ma.masked_where(mask, sds)
    copy_tif(src_tif=temp,
             dst_tif=dst_tif,
             data=sds)

    fdir, bsn = os.path.split(temp)
    cmd = f'del /f {bsn}' if os.name == 'nt' else f'rm -f {bsn}'
    subprocess.call(cmd, cwd=fdir, shell=True)

    # cmap = 'RdBu_r'
    # fig, ax = plt.subplots(figsize=(6, 4))
    # im = ax.imshow(sds, cmap=cmap, norm=colors.CenteredNorm())
    # fig.colorbar(im, ax=ax)
    # plt.show()
    # os.system('gdalinfo dst_tif')

    return meta


def swath_resample(swath: dict, trg_proj: AreaDefinition):
    """
    resamples swath data into a new grid defined by trg_proj.
    trg_proj is constructed using pyresample (see map_proj)

    Parameters
    ----------
        swath: dict
            dictionary with keys
                radius_of_influence float:
                    search distance in m for data resampling
                channels ma.array:
                    ma.dstack masked array with the data being resampled
                latitude array:
                    latitude with swath pixel_control_points and number_of_lines
                longitude ndarray:
                    longitude with swath pixel_control_points and number_of_lines
        trg_proj: AreaDefinition
            target projection for data resampling

    Returns
    -------
        ma.array
            result with data resampled to trg_proj
    """

    warnings.filterwarnings('ignore')

    epsilon = swath.pop('epsilon')
    radius_of_influence = swath.pop('radius_of_influence')

    src_sds = swath.pop('channels')
    src_proj = SwathDefinition(
        lons=swath.pop('longitude'),
        lats=swath.pop('latitude'))

    nprocs = 4 if len(src_sds.shape) > 2 else 1
    result = resample_nearest(
        src_proj, src_sds, trg_proj, fill_value=None,
        epsilon=epsilon, nprocs=nprocs,
        radius_of_influence=radius_of_influence)

    return result


def write_tif(file: str, dataset: np.array, metadata: dict,
              area_def: AreaDefinition, data_type: str = 'Float32'):
    """writes out the resampled data into geotiff format
    https://gdal.org/tutorials/raster_api_tut.html

    Parameters
    ----------

    file: str
       target filename to save the tiff file
    dataset: ndarray
       3-D array with resampled masked arrays (generated by ma.dstack and resampled with pyresample)
    metadata: dict
       attributes of each key (variable) in dataset as well as global attributes
    area_def: AreaDefinition
       pyproj data constructed with map_proj containing information about the data projection
    data_type: str
       data type of the gdal. Either Float32 or Int32 for the case of flags
    Returns
    -------
      sds: dict
    """

    driver = gdal.GetDriverByName("GTiff")
    dtype = gdal.GDT_Float32
    fill_type = float
    if data_type == 'Int32':
        dtype = gdal.GDT_Int32
        fill_type = int
    width = area_def.width
    height = area_def.height
    glob_attrs = metadata.pop('glob_attrs')
    n_bands = len(metadata)

    # ---------------------
    # create the output tif
    # ---------------------
    trg_dst = driver.Create(file, width, height, n_bands, dtype)
    meta = {key: f'{val}' for key, val in glob_attrs.items()}
    trg_dst.SetMetadata(meta)

    # ------------------------
    # set the affine transform
    # ------------------------
    geo_transform = [area_def.area_extent[0],
                     area_def.pixel_size_x, 0,
                     area_def.area_extent[3], 0,
                     -area_def.pixel_size_y]
    trg_dst.SetGeoTransform(geo_transform)

    # ---------------------
    # osr output projection
    # ---------------------
    srs = osr.SpatialReference()
    srs.ImportFromProj4(area_def.proj_str)
    srs.SetProjCS(area_def.crs.to_dict()['proj'])
    srs.SetWellKnownGeogCS("WGS84")
    trg_dst.SetProjection(srs.ExportToWkt())

    # ---------------------
    # iterate over the bands
    # ---------------------
    for i, name in enumerate(metadata.keys()):
        band_num = i + 1

        band_meta = metadata[name]
        try:
            sds = dataset[:, :, i]
        except IndexError:
            sds = dataset

        # -------------------
        # original fill_value
        # -------------------
        if name not in ('l2_flags', 'QA_flag'):
            band_meta['valid_min'] = sds.min().astype(np.float32)
            band_meta['valid_max'] = sds.max().astype(np.float32)
        trg_band = trg_dst.GetRasterBand(band_num)
        trg_band.SetDescription(name)

        if 'scale_factor' in band_meta.keys():
            band_meta.pop('scale_factor')
        if 'add_offset' in band_meta.keys():
            band_meta.pop('add_offset')

        band_meta = {key: f'{val}' for key, val in band_meta.items()}
        trg_band.SetMetadata(band_meta)
        fill_value = band_meta['_FillValue']

        mask = sds.mask.copy()
        sds[mask] = fill_value
        sds.mask = mask

        trg_band.SetNoDataValue(fill_type(fill_value))
        trg_band.WriteArray(sds)
        trg_band.FlushCache()  # Export data

        meta.update(band_meta)
    # ------------------
    # close output image
    # ------------------
    trg_dst = None
    return meta


def copy_tif(src_tif: str, dst_tif: str, data):
    """
        Copy geotif from source file (src_tif) to target file (dst_tif) and updates the data array

        Parameters
        ----------
        src_tif: str
           path to template raster from where to copy the tiff file and its structure
        dst_tif: str
           output filename for new raster
        data
           data set
        Returns
        -------
          None
    """
    # -------------
    # open template
    # -------------
    src = gdal.Open(src_tif, gdal.GA_ReadOnly)

    # --------------------
    # geotiff driver/dtype
    # --------------------
    driver = gdal.GetDriverByName('GTiff')
    band = src.GetRasterBand(1)
    dtype = gdal.GDT_Float32
    if gdal.GetDataTypeName(band.DataType) == 'Int32':
        dtype = gdal.GDT_Int32

    # -----------
    # raster copy
    # -----------
    trg = driver.Create(dst_tif, src.RasterXSize,
                        src.RasterYSize, 1,
                        dtype, ['COMPRESS=LZW'])

    # --------
    # metadata
    # --------
    trg.SetGeoTransform(src.GetGeoTransform())
    trg.SetProjection(src.GetProjection())
    trg.SetMetadata(src.GetMetadata())

    trg_band = trg.GetRasterBand(1)
    meta = band.GetMetadata()
    meta['valid_min'] = f'{data.min()}'
    meta['valid_max'] = f'{data.max()}'
    trg_band.SetMetadata(meta)

    # -----------
    # Write array
    # -----------
    trg_band.SetNoDataValue(int(meta['_FillValue']))
    trg_band.WriteArray(data)
    trg_band.FlushCache()

    # -------
    # closing
    # -------
    trg = None
    return trg


def gdal_translate(src_tif: str, dst_tif: str, nodata,
                   ot: str = 'Float32', trg_proj: str = 'EPSG:4326'):
    """Gdal Warping/Translate
    gdalwarp available resampling methods:
    near (default), bilinear, cubic, cubicspline, lanczos, average, mode,  max, min, med, Q1, Q3, sum.\n
    gdalwarp -r resampling_method
    https://gdal.org/tutorials/index.html

    Parameters
    ----------
    src_tif: str
        source file being reprojected
    dst_tif: str
        target file after reprojected
    nodata: int | float
        fill_values
    trg_proj: str
        target projection name
    ot: str
        data type for the gdalwarp command

    Returns
    -------
        str:
            path to the gdal projected geotif file
    """

    # --------------
    # WARP/TRANSLATE
    # --------------
    cmd = 'gdalwarp ' \
          f'-t_srs {trg_proj} ' \
          f'-srcnodata "{nodata}" ' \
          f'-dstnodata "{nodata}" ' \
          f'-wo INIT_DEST={nodata} ' \
          '-co "PREDICTOR=2" ' \
          '-co "tiled=yes" ' \
          f'-ot {ot} ' \
          f'-of vrt {src_tif} ' \
          '/vsistdout/ | ' \
          'gdal_translate ' \
          '-co compress=lzw ' \
          f'/vsistdin/ {dst_tif}'

    os.system(cmd)

    # --------------------
    # Get rid of input tif
    # --------------------
    fdir = os.path.dirname(src_tif)
    bsn = os.path.basename(src_tif)
    cmd = f'del /f {bsn}' if os.name == 'nt' else f'rm -f {bsn}'
    subprocess.call(cmd, cwd=fdir, shell=True)

    return dst_tif
