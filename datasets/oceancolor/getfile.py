#!/usr/bin/env python3
# coding: utf-8

"""
Parts of the script are obtained from the NASA data matchup
script written by J.Scott on 2016/12/12 (joel.scott@nasa.gov)

Perform searches of the EarthData Common Metadata Repository (CMR)
and JAXA's Catalogue Service-Web (CSW) for satellite granule names and download links.
E.R.MAURE on 2020/10/07 (maure@npec.or.jp)
"""

import logging
import os
import re
import sys
import textwrap
import time
from datetime import datetime
from netrc import netrc
from pprint import pprint

import coloredlogs
import requests
from dateutil.parser import parse
from logger import config

from filesanity import check

logger = logging.getLogger(__name__)
level = logging.DEBUG
logger.setLevel(level)

now = datetime.today().strftime('%Y%jT%H%M%S')
logger_file = f'{os.getcwd()}/logs/'
LOGGING_FMT = '\n%(module)s.%(funcName)s:%(lineno)d'
ENCODED_STYLES = 'debug=magenta;info=green;warning=yellow;critical=red,bold;exception=blue'
if not os.path.exists(logger_file):
    os.makedirs(logger_file)
logger = config(logger=logger, logger_name=f'{logger_file}{now}.log')
coloredlogs.install(level=level, fmt=f'{LOGGING_FMT}\n%(message)s',
                    level_styles=coloredlogs.parse_encoded_styles(ENCODED_STYLES), logger=logger)

__version__ = '1.0.0'
debug = False

# dictionary of lists of CMR platform, instrument, collection names
SATELLITES = {
    'czcs': {'instrument': 'CZCS', 'platform': 'Nimbus-7', 'search': 'CZCS_L2_'},
    'goci': {'instrument': 'GOCI', 'platform': 'COMS', 'search': 'GOCI_L2_'},
    'meris': {'instrument': 'MERIS', 'platform': 'ENVISAT', 'search': 'MERIS_L2_'},
    'modisa': {'instrument': 'MODIS', 'platform': 'AQUA', 'search': 'MODISA_L2_'},
    'modist': {'instrument': 'MODIS', 'platform': 'TERRA', 'search': 'MODIST_L2_'},
    'octs': {'instrument': 'OCTS', 'platform': 'ADEOS-I', 'search': 'OCTS_L2_'},
    'seawifs': {'instrument': 'SeaWiFS', 'platform': 'OrbView-2', 'search': 'SeaWiFS_L2_'},
    'sgli': {'instrument': 'SGLI', 'platform': 'GCOM-C', 'search': 'GC1SG1_*_L2SG_*_'},
    'viirsn': {'instrument': 'VIIRS', 'platform': 'NPP', 'search': 'VIIRSN_L2_'},
    'viirsj': {'instrument': 'VIIRS', 'platform': 'JPSS1', 'search': 'VIIRSJ1_L2_'}
}


class UrlParser:
    def __init__(self, tim_min, tim_max, **kwargs):
        sat = kwargs.pop('sat')
        self.instrument = SATELLITES[sat]['instrument']
        self.platform = SATELLITES[sat]['platform']
        self.tim_min = tim_min
        self.tim_max = tim_max
        self.slon = None
        self.slat = None
        self.elat = None
        self.elon = None
        self.data_type = ''
        for key, val in kwargs.items():
            setattr(self, key, val)
        self.short_name = f"{SATELLITES[sat]['search']}{self.data_type.upper()}"
        if self.data_type.lower() == 'sst':
            platform, instrument = (f'S{self.platform}', self.instrument) \
                if sat == 'viirsn' else (self.platform, self.instrument)
            self.short_name = f'{platform}_{instrument}*.L2.SST.nc'

    def cmr_polygon(self):
        if self.platform in ('JPSS1', 'ENVISAT'):
            return f"https://cmr.earthdata.nasa.gov/search/granules.json?page_size=50" \
                   f"&provider=OB_DAAC&bounding_box={self.slon},{self.slat},{self.elon},{self.elat}" \
                   f"&short_name={self.short_name}" \
                   f"&temporal={self.tim_min.strftime('%Y-%m-%dT%H:%M:%SZ')}," \
                   f"{self.tim_max.strftime('%Y-%m-%dT%H:%M:%SZ')}" \
                   f"&instrument={self.instrument}&platform={self.platform}" \
                   f"&sort_key=short_name&options[short_name][pattern]=true"

        return f"https://cmr.earthdata.nasa.gov/search/granules.json?page_size=50" \
               f"&provider=OB_DAAC&bounding_box={self.slon},{self.slat},{self.elon},{self.elat}" \
               f"&short_name={self.short_name}" \
               f"&temporal={self.tim_min.strftime('%Y-%m-%dT%H:%M:%SZ')}," \
               f"{self.tim_max.strftime('%Y-%m-%dT%H:%M:%SZ')}" \
               f"&instrument={self.instrument}&platform={self.platform}" \
               f"&sort_key=short_name&options[short_name][pattern]=true"

    def csw_polygon(self):
        return 'https://gportal.jaxa.jp/csw/csw?service=CSW&version=3.0.0&request=GetRecords' \
               f'&outputFormat=application/json&bbox={self.slon},{self.slat},{self.elon},' \
               f'{self.elat}&pslv=L2&sat=GCOM-C&datasetId={self.get_id()}' \
               f'&count=50&sen=SGLI&startTime={self.tim_min.strftime("%Y-%m-%dT%H:%M:%SZ")}' \
               f'&endTime={self.tim_max.strftime("%Y-%m-%dT%H:%M:%SZ")}'

    def get_id(self):
        """
            L2 Chlorophyll-a concentration etc.: 10002001
            L2 SST : 10002002 (Daytime and Nighttime are the same Dataset ID.)
            L2 NWLR : 10002000 (Including "Normalized water leaving radiance",
                                "Photosynthetically available radiation" and
                                "Atmosphere correction parameter".)
        """
        if self.data_type == '*':
            return '10002000,10002001,10002002'
        if self.data_type == 'rrs':
            return '10002000'
        if self.data_type == 'oc':
            return '10002001'
        if self.data_type == 'sst':
            return '10002002'
        if self.data_type == 'iop':
            raise SwathFinderError('IOP not defined for SGLI')


class SwathFinderError(Exception):
    """A custom exception used to report errors in use of Timer class"""

    def __init__(self, message: str):
        super().__init__(message)


def get_auth(host: str):
    """
    Retrieve my credentials for satellite data download
    @param host:
    @return:
    """
    net_rc = netrc()
    user, _, passwd = net_rc.authenticators(host)
    return user, passwd


def file_search(url: str, sen: str):
    """ function to submit a given URL request to the CMR; return JSON output """

    # print(url)
    response = requests.get(url)
    content = response.json()
    if debug:
        logger.info(content)

    if sen != 'sgli':
        return content

    fmt_content = {'feed': {'entry': []}}
    append = fmt_content['feed']['entry'].append

    # pprint(f'Content: {content}\n')
    files = re.findall('standard/GCOM-C/GCOM-C.SGLI/L2.OCEAN.*/GC1SG1_.*Q_20.*.h5',
                       '\n'.join([feature['properties']['product']['fileName']
                                  for feature in content['features']]))
    for href in files:
        producer_granule_id = os.path.basename(href)
        entry = {'producer_granule_id': producer_granule_id,
                 'links': [{'href': href}]}
        append(entry)
    return fmt_content


def wget_file(url: str, out_dir: str, case: str):
    """
    cmr_download_file downloads a file
    given URL and out_dir strings
    syntax fname_local = cmr_download_file(url, out_dir)
    """

    bsn = os.path.basename(url)
    local_dir = os.path.abspath(out_dir)
    local_filename = os.path.abspath(f'{local_dir}/{bsn}')

    if case == 'cmr':
        host = 'urs.earthdata.nasa.gov'
        user, passwd = get_auth(host=host)
        home = os.path.expanduser('~/')
        cmd = f'wget --load-cookies {home}.urs_cookies --save-cookies {home}.urs_cookies ' \
              f'--user={user} --password={passwd} -nc ' \
              f'--auth-no-challenge=on --keep-session-cookies ' \
              f'--content-disposition "{url}" --directory-prefix={local_dir}'
        ext = os.system(cmd)

        if ext == 0:
            logger.info(f'{url} --> SUCCESS!')
        return local_filename

    if case == 'csw':
        """
        Data retrieval function
        @return: a list of downloaded files
        """
        # get auth
        host = 'ftp.gportal.jaxa.jp'
        user, passwd = get_auth(host=host)

        cmd = f'wget -nc --preserve-permissions --remove-listing --tries=5 ' \
              f'ftp://{user}:{passwd}@{host}/{url} --directory-prefix={local_dir}'
        ext = os.system(cmd)
        if ext == 0:
            logger.info(f'{url} --> SUCCESS!')
        return local_filename


def process_request(content, out_dir: str, case: str):
    """ function to process the return from a single CMR JSON return """

    download_files = []
    append = download_files.append

    try:
        for entry in content['feed']['entry']:
            granid = entry['producer_granule_id']

            if 'SST.NRT.nc' in granid:
                this_f = entry['links'][0]['href']
                print(f'Download\n\tID: {granid}\n\tLink: {this_f} | Skipping...\n')
                continue

            if out_dir:
                local_filename = wget_file(
                    case=case,
                    url=entry['links'][0]['href'],
                    out_dir=out_dir
                )
                append(local_filename)
            else:
                append(entry['links'][0]['href'])

    except Exception as e:
        logger.exception('WARNING: No matching granules found for a row. Continuing to search'
                         ' for granules from the rest of the input file...', exc_info=e)
    return download_files


def fetch_files(parse_vars: dict, start: float):
    """handles inputs from a file"""

    if parse_vars['get_data'] is None:
        return '\n'

    sat = parse_vars['sat'][0]
    case = 'csw' if sat == 'sgli' else 'cmr'

    if debug:
        logger.debug(parse_vars['data_type'])

    url_parser = UrlParser(tim_min=parse_vars.pop('stime')[0],
                           tim_max=parse_vars.pop('etime')[0],
                           **{key: val[0]
                              for key, val in parse_vars.items()
                              if val is not None})

    url = url_parser.csw_polygon() if sat == 'sgli' else url_parser.cmr_polygon()
    if debug:
        logger.debug(url)
    content = file_search(url=url, sen=sat)

    # ------------------
    # Download the files
    # ------------------
    files = process_request(content=content,
                            out_dir=parse_vars['get_data'][0],
                            case=case)
    files = check(check_list=files, instrument=sat)

    # -----------------
    # Return the result
    # -----------------
    time_elapsed = (time.perf_counter() - start)
    hrs = int(time_elapsed // 3600)
    mnt = int(time_elapsed % 3600 // 60)
    sec = int(time_elapsed % 3600 % 60)
    logger.info(f'Processing Time:{hrs:3} hrs'
                f'{mnt:3} min{sec:3} sec')

    return '\n'.join(files)


def cli_main():
    import argparse

    start = time.perf_counter()
    parser = argparse.ArgumentParser(formatter_class=argparse.RawTextHelpFormatter, description='''\
      This program uses Earthdata Search Tool (https://cmr.earthdata.nasa.gov/search/) based on Common 
      Metadata Repository (CMR) and GPortal's Search Tool (https://gportal.jaxa.jp/csw/csw) based on 
      comparative web search (CSW) system to find collections from the data provided by the NASA OB.DAAC
      and JAXA GPortal. The tool finds satellite granule names given an satellite/instrument and 
      lat/lon/time point or range information.

      Outputs:
         1a) a list of OB.DAAC L2 satellite file granule names that contain the input criteria, per the CMR's records.
         1b) a list of GPortal L2 satellite file granule names that contain the input criteria, per the CSW's records.
         2) a list of public download links to fetch the matching satellite file granules, per the CMR's/CSW's records.

      Inputs:
        The argument-list is a set of --keyword value pairs (see optional arguments below).

        * Compatibility: This script was developed with Python 3.7.

      ''', epilog=textwrap.dedent('''\
        Type python getfile.py --help for details.
        --------
        Examples usage calls:
            python getfile.py --sat=modisa --slat=30 --elat=40 --slon=130 --elon=140 --stime=2021-01-10T00:00:00Z --etime=2021-01-10T23:59:59Z --data_type=oc --get_data=~/L2Data
            python getfile.py --sat=sgli --slat=30 --elat=40 --slon=130 --elon=140 --stime=2021-01-10T00:00:00Z --etime=2021-01-10T23:59:59Z --data_type=oc --get_data=~/L2Data
            python getfile.py --sat=sgli --slat=30 --elat=40 --slon=130 --elon=140 --stime=2021-01-10T00:00:00Z --etime=2021-01-10T23:59:59Z --data_type=rrs --get_data=~/L2Data
                                           '''), add_help=True)

    parser.add_argument('--sat', choices=['sgli', 'modisa', 'viirsn', 'viirsj',
                                          'goci', 'czcs', 'octs', 'seawifs'],
                        type=str, nargs=1, required=True, help='''\
      String specifier for satellite platform/instrument

      Valid options are:
      -----------------
      sgli    = SGLI on GCOM-C
      viirsn  = VIIRS on NPP
      viirsj  = VIIRS on JPSS1
      modisa  = MODIS on AQUA
      goci    = GOCI on COMS
      czcs    = CZCS on Nimbus-7
      seawifs = SeaWiFS on OrbView-2
      octs    = OCTS on ADEOS-I
      ''')

    parser.add_argument('--data_type', nargs=1, type=str, default=(['*']),
                        choices=['oc', 'iop', 'rrs', 'sst'], help='''\
      OPTIONAL: String specifier for satellite data type
      Default behavior returns all product suites

      Valid options are:
      -----------------
      oc  = Returns OC (ocean color) product suite. Returns (CDOM, CHLA, TSM) if --sat == sgli 
      iop = Returns IOP (inherent optical properties) product suite. Raises error if --sat == sgli 
      rrs = Returns RRS (remote sensing reflectance) product suite from sgli
      sst = Returns SST product suite (including SST3, SST4 where applicable)
      ''')

    parser.add_argument('--stime', nargs=1, type=str, help='''\
      Time (point) of interest in UTC
      Default behavior: return matches within +/- MAX_TIME_DIFF (default +/-3 hours) about this given time
      If used with ETIME, this creates a search time window, between STIME and ETIME.
      Valid format: string of the form: yyyy-mm-ddThh:mm:ssZ
      OPTIONALLY: Use with --max_time_diff or --etime
      ''')

    parser.add_argument('--etime', nargs=1, type=str, help='''\
      Maximum time (range) of interest in UTC
      Valid format: string of the form: yyyy-mm-ddThh:mm:ssZ
      OPTIONAL: if not provided, this corresponds to --stime + 3
      Use with --stime
     ''')

    parser.add_argument('--slat', nargs=1, type=float, help=('''\
      Starting latitude, south-most boundary 
      Valid range: (-90, 90N)
      '''))

    parser.add_argument('--elat', nargs=1, type=float, help=('''\
      Ending latitude, north-most boundary
      OPTIONAL: when not provided, the search is around the point (slat, slon)
      Valid range: (-90, 90N)
      '''))

    parser.add_argument('--slon', nargs=1, type=float, help=('''\
      Starting longitude, west-most boundary
      Valid range: (-180, 180E)
      '''))

    parser.add_argument('--elon', nargs=1, type=float, help=('''\
      Ending longitude, east-most boundary
      OPTIONAL: when not provided, the search is around the point (slat, slon)
      Valid range: (-180, 180E)
      '''))

    parser.add_argument('--get_data', nargs=1, type=str, help='''\
      Flag to download all identified satellite granules.
      Requires the use of an HTTP request.
      Set this value to the desired output directory.
      ''')

    parse_args = parser.parse_args()
    parse_vars = vars(parse_args)

    if parse_args.get_data:
        if not parse_vars['get_data'][0] or not os.path.exists(parse_vars['get_data'][0]):
            info = 'invalid --get_data target download directory provided. ' \
                   'Do not use any trailing slash or backslash characters.'
            logger.exception(info) if debug else parser.error(info)

    parse_vars['stime'] = [parse(parse_vars['stime'][0])]
    if parse_vars['etime']:
        parse_vars['etime'] = [parse(parse_vars['etime'][0])]

    result = fetch_files(parse_vars=parse_vars, start=start)
    print(result)
    return


if __name__ == "__main__":
    cli_main()
