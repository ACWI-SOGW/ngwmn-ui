"""
NGWMN UI application views

"""
from urllib.parse import urljoin

from flask import abort, render_template
import requests as r

from . import app
from .services.ngwmn import generate_bounding_box_values, get_well_lithography
from .services.sifta import get_cooperators
from .xml_utils import parse_xml


SERVICE_ROOT = app.config.get('SERVICE_ROOT')


@app.route('/well-location/<agency_cd>/<location_id>/', methods=['GET'])
def well_page(agency_cd, location_id):
    """
    Well location view.

    :param str agency_cd: agency code for the agency that manages the location
    :param location_id: the location's identifier

    """
    root = get_well_lithography(SERVICE_ROOT, agency_cd, location_id)
    cooperators = get_cooperators(location_id)
    if root is not None and 'gml' in root.nsmap.keys():
        geolocation_element = root.find('.//gml:Point/gml:pos', namespaces=root.nsmap)
        geolocation = geolocation_element.text
        latitude, longitude = geolocation.split(' ')
        bbox = generate_bounding_box_values(latitude, longitude)
        data = {
            'SERVICE': 'WFS',
            'VERSION': '1.0.0',
            'srsName': 'EPSG:4326',
            'outputFormat': 'GML2',
            'typeName': 'ngwmn:VW_GWDP_GEOSERVER',
            'CQL_FILTER': "((QW_SN_FLAG='1') OR (WL_SN_FLAG='1')) AND (BBOX(GEOM,{},{},{},{}))".format(*bbox)
        }
        params = {'request': 'GetFeature'}
        target = urljoin(SERVICE_ROOT, 'ngwmn/geoserver/wfs')
        resp = r.post(target, params=params, data=data)
        if resp.status_code == 200:
            summary = parse_xml(resp.content)
            location_name = summary.find('.//ngwmn:SITE_NAME', namespaces=summary.nsmap).text
            template = 'well_location.html'
            context = {
                'location_name': location_name,
                'cooperators': cooperators
            }
            http_code = 200
            # return render_template('well_location.html', location_name=location_name)
        elif 400 <= resp.status_code < 500:
            template = 'well_location.html'
            http_code = 200
            context = {'status_code': resp.status_code, 'reason': resp.reason}
        elif 500 <= resp.status_code <= 511:
            template = 'errors/500.html'
            context = {}
            http_code = 503
        else:
            template = 'errors/500.html'
            context = {}
            http_code = 500
        return render_template(template, **context), http_code
    return abort(404)
