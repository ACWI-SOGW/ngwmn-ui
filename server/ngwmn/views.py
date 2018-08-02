"""
NGWMN UI application views

"""

from flask import abort, jsonify, render_template

from . import __version__, app
from .services.ngwmn import get_features, get_iddata, get_water_quality_activities
from .services.sifta import get_cooperators


@app.route('/')
def home():
    return render_template(
        'index.html',
        version=__version__,
        test_sites=[
            {'agency_cd': 'USGS', 'location_id': '353945105574502'},
            {'agency_cd': 'USGS', 'location_id': '282532081075601'},
            {'agency_cd': 'USGS', 'location_id': '473442118162201'},
            {'agency_cd': 'USGS', 'location_id': '423532088254601'},
            {'agency_cd': 'USGS', 'location_id': '401105074120205'},
            {'agency_cd': 'USGS', 'location_id': '411958079540202'},
            {'agency_cd': 'ADWR', 'location_id': '334306112433801'},
            {'agency_cd': 'DGS', 'location_id': 'Eb53-33'},
            {'agency_cd': 'KSGS', 'location_id': '381107098532401'},
            {'agency_cd': 'MEGS', 'location_id': '39412'},
            {'agency_cd': 'MBMG', 'location_id': '235474'},
            {'agency_cd': 'TWRB', 'location_id': '2763901'}
        ]
    )


@app.route('/version')
def version():
    """Render the home page."""
    return jsonify({
        'version': __version__
    })


@app.route('/site-location/<agency_cd>/<location_id>/', methods=['GET'])
def site_page(agency_cd, location_id):
    """
    Site location view.

    :param str agency_cd: agency code for the agency that manages the location
    :param location_id: the location's identifier

    """

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
