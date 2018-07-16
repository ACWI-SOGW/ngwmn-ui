"""
NGWMN UI application views

"""

from flask import abort, render_template

from . import app
from .services.ngwmn import get_well_lithography, get_features
from .services.sifta import get_cooperators


@app.route('/site-location/<agency_cd>/<location_id>/', methods=['GET'])
def site_page(agency_cd, location_id):
    """
    Site location view.

    :param str agency_cd: agency code for the agency that manages the location
    :param location_id: the location's identifier

    """
    root = get_well_lithography(agency_cd, location_id)
    if root is None or 'gml' not in root.nsmap.keys():
        return abort(404)

    geolocation_element = root.find('.//gml:Point/gml:pos', namespaces=root.nsmap)
    geolocation = geolocation_element.text
    latitude, longitude = geolocation.split(' ')
    summary = get_features(latitude, longitude)

    return render_template(
        'site_location.html',
        cooperators=get_cooperators(location_id),
        feature=summary['features'][0]['properties']
    ), 200
