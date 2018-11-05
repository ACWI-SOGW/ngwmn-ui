"""
NGWMN UI application views

"""

from functools import reduce

from flask import abort, jsonify, render_template

from . import __version__, app
from .services.ngwmn import get_features, get_water_quality, get_well_log, get_statistics, get_providers
from .services.sifta import get_cooperators


@app.route('/')
def home():
    """testing home page"""
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

@app.route('/provider/', methods=['GET'])
def providers():
    """
    NGWMN available providers view

    """
    return render_template('providers.html', providers=get_providers())


@app.route('/provider/<agency_cd>/', methods=['GET'])
def provider(agency_cd):
    """
    NGWMN provider information view
    """
    return 'Not yet implemented'


@app.route('/site-location/<agency_cd>/<location_id>/', methods=['GET'])
def site_page(agency_cd, location_id):
    """
    Site location view.

    :param str agency_cd: agency code for the agency that manages the location
    :param location_id: the location's identifier

    """

    well_log = get_well_log(agency_cd, location_id)
    if not well_log:
        return abort(404)

    summary = get_features(
        well_log['location']['latitude'],
        well_log['location']['longitude']
    )
    water_quality = get_water_quality(agency_cd, location_id)

    feature = summary['features'][0]['properties']

    if 'organization' in water_quality:
        organization = water_quality['organization']['name']
    else:
        organization = feature.get('AGENCY_NM')

    # Get the unique list of lithology IDs in the well log
    lithology_ids = reduce(
        lambda ids, entry: ids.union(entry['unit']['ui']['materials']),
        well_log.get('log_entries', []),
        set()
    )

    return render_template(
        'site_location.html',
        cooperators=get_cooperators(location_id),
        feature=feature,
        organization=organization,
        water_quality_activities=water_quality.get('activities') or [],
        well_log=well_log,
        lithology_ids=lithology_ids,
        stats=get_statistics(agency_cd, location_id)
    ), 200
