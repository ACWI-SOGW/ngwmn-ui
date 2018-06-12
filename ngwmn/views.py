"""
NGWMN UI application views
"""
from urllib.parse import urljoin

from flask import abort, render_template
import requests as r

from . import app
from .utils import parse_xml, get_well_lithography


SERVICE_ROOT = app.config.get('SERVICE_ROOT')


@app.route('/well-location/<agency_cd>/<location_id>', methods=['GET'])
def well_page(agency_cd, location_id):
    """
    Well location view.

    :param str agency_cd: agency code for the agency that manages the location
    :param location_id: the location's identifier

    """
    root = get_well_lithography(SERVICE_ROOT, agency_cd, location_id)
    if root is not None and 'gml' in root.nsmap.keys():
        geolocation_element = root.find('.//gml:Point/gml:pos', namespaces=root.nsmap)
        geolocation = geolocation_element.text
        latitude, longitude = geolocation.split(' ')
        lat_lower = float(latitude) - 0.01
        lon_lower = float(longitude) - 0.01
        lat_upper = float(latitude) + 0.01
        lon_upper = float(longitude) + 0.01
        data = {
            'SERVICE': 'WFS',
            'VERSION': '1.0.0',
            'srsName': 'EPSG:4326',
            'outputFormat': 'GML2',
            'typeName': 'ngwmn:VW_GWDP_GEOSERVER',
            'CQL_FILTER': "((QW_SN_FLAG='1') OR (WL_SN_FLAG='1')) AND (BBOX(GEOM,{},{},{},{}))".format(
                lon_lower,
                lat_lower,
                lon_upper,
                lat_upper
            )
        }
        params = {'request': 'GetFeature'}
        target = urljoin(SERVICE_ROOT, 'ngwmn/geoserver/wfs')
        resp = r.post(target, params=params, data=data)
        summary = parse_xml(resp.content)
        location_name = summary.find('.//ngwmn:SITE_NAME', namespaces=summary.nsmap).text
        return render_template('well_location.html', location_name=location_name)
    else:
        return abort(404)
