"""
Functions for accessing information from a confluence RSS feed
"""

import requests

from ngwmn import app


def pull_feed(url):
    """
    pull page data from a my.usgs.gov MD dynamic content pages
    :param url: the url of the dynamic content
    :return: the html of the page itself
    """
    app.logger.debug('Parsing content from %s.', url)
    response = requests.get(url)

    # TODO error handling

    return response.text


MAIN_CONTENT = 'main'
SITE_SELECTION_CONTENT = 'siteselect'
DATA_COLLECTION_CONTENT = 'datacollection'
DATA_MANAGEMENT_CONTENT = 'datamanagement'
OTHER_AGENCY_INFO_CONTENT = 'otherinfo'


def confluence_url(agency_cd, content_type):
    """
    Return confluence url containing information for the agency and content type
    :param str agency_cd:
    :param str content_type:
    :rtype str
    """
    return '{0}/{1}/{2}'.format(
        app.config['CONFLUENCE_URL'],
        agency_cd,
        content_type
    )
