"""
NGWMN UI application views

"""

from flask import abort, jsonify, render_template

from . import __version__, app
from .services.ngwmn import get_features, get_water_quality, get_well_log, get_statistics, get_providers, get_sites
from .services.confluence import (
    pull_feed, confluence_url, MAIN_CONTENT, SITE_SELECTION_CONTENT, DATA_COLLECTION_CONTENT, DATA_MANAGEMENT_CONTENT,
    OTHER_AGENCY_INFO_CONTENT, STATISTICS_METHODS_URL)
from .string_utils import generate_subtitle


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

@app.route('/statistics-methods', methods=['GET'])
def statistics_methods():
    """
    NGWMN statistics methods view
    """
    return render_template('statistics_methods.html', stats_methods=pull_feed(STATISTICS_METHODS_URL))

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
    providers = get_providers()
    providers_by_agency_cd = dict(map(lambda x: (x['agency_cd'], x), providers))
    if agency_cd not in providers_by_agency_cd:
        return '{0} is not a valid agency code'.format(agency_cd), 404

    return render_template('provider.html', agency_metadata=providers_by_agency_cd.get(agency_cd),
                           provider_content=pull_feed(confluence_url(agency_cd, MAIN_CONTENT)),
                           site_selection=pull_feed(confluence_url(agency_cd, SITE_SELECTION_CONTENT)),
                           data_collection=pull_feed(confluence_url(agency_cd, DATA_COLLECTION_CONTENT)),
                           data_management=pull_feed(confluence_url(agency_cd, DATA_MANAGEMENT_CONTENT)),
                           other_agency_info=pull_feed(confluence_url(agency_cd, OTHER_AGENCY_INFO_CONTENT)))


@app.route('/provider/<agency_cd>/site/', methods=['GET'])
def sites(agency_cd):
    """
    A list of NGWMN sites for an agency_cd
    :param str agency_cd:
    """
    site_list = get_sites(agency_cd)
    if not site_list:
        return '{0} is not a valid agency code'.format(agency_cd), 404
    return render_template('sites.html',
                           sites=site_list)


@app.route('/provider/<agency_cd>/site/<location_id>/', methods=['GET'])
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

    # reduce the amount of data returned from GeoServer to only the monitoring location of interest
    # this section is important for monitoring locations that have the same geographical coordinates (i.e. nested wells)
    feature = {}
    for a_single_feature in summary['features']:
        if a_single_feature['properties']['SITE_NO'] == location_id:
            feature = a_single_feature['properties']
            break

    if 'organization' in water_quality:
        organization = water_quality['organization']['name']
    else:
        organization = feature.get('AGENCY_NM')

    # run the logic to create web page subtitle also known as the 'monitoring location description'
    monitoring_location_description = generate_subtitle(feature)

    # Get the unique list of best-choice lithology IDs in the well log
    lithology_ids = set()
    for entry in well_log.get('log_entries', []):
        materials = entry['unit'].get('ui', {}).get('materials')
        if materials:
            lithology_ids.add(materials[0])

    return render_template(
        'site_location.html',
        feature=feature,
        organization=organization,
        water_quality_activities=water_quality.get('activities') or [],
        well_log=well_log,
        lithology_ids=lithology_ids,
        stats=get_statistics(agency_cd, location_id),
        monitoring_location_description=monitoring_location_description
    ), 200
