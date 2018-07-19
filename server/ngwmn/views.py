"""
NGWMN UI application views

"""

from flask import abort, render_template

from . import app
from .services.ngwmn import get_features, get_iddata, get_water_quality_activities
from .services.sifta import get_cooperators


@app.route('/site-location/<agency_cd>/<location_id>/', methods=['GET'])
def site_page(agency_cd, location_id):
    """
    Site location view.

    :param str agency_cd: agency code for the agency that manages the location
    :param location_id: the location's identifier

    """

    # FIXME: hack to get around network problems
    # return render_template(
    #     'site_location.html',
    #     feature={'SITE_NO': location_id, 'DEC_LAT_VA': 0, 'DEC_LONG_VA': 0},
    #     cooperator=[],
    #     water_quality_activities=[]
    # ), 200


    root = get_iddata('well_log', agency_cd, location_id)
    if root is None or 'gml' not in root.nsmap.keys():
        return abort(404)

    geolocation_element = root.find('.//gml:Point/gml:pos', namespaces=root.nsmap)
    geolocation = geolocation_element.text
    latitude, longitude = geolocation.split(' ')
    summary = get_features(latitude, longitude)

    water_quality_activities = get_water_quality_activities(agency_cd, location_id)

    return render_template(
        'site_location.html',
        cooperators=get_cooperators(location_id),
        feature=summary['features'][0]['properties'],
        water_quality_activities=water_quality_activities
    ), 200
