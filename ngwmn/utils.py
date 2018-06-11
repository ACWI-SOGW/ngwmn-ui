"""
Utility functions

"""
from urllib.parse import urljoin
import xml.etree.ElementTree as ET

import requests as r


def get_well_lithography(service_root, agency_cd, location_no):
    lithography_target = urljoin(service_root, 'ngwmn/iddata')
    query_params = {
        'request': 'well_log',
        'agency_cd': agency_cd,
        'siteNo': location_no
    }
    resp = r.get(lithography_target, params=query_params)
    return resp
