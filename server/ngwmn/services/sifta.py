"""
Helpers to retrieve SIFTA cooperator data.
"""

import requests

from ngwmn import app


def get_cooperators(site_no):
    """
    Gets the cooperator data from the SIFTA service
    :param site_no: USGS site number
    """

    url = app.config['COOPERATOR_SERVICE_PATTERN'].format(site_no=site_no)
    try:
        response = requests.get(url)
    except requests.exceptions.RequestException as err:
        app.logger.error(str(err))
        return []

    # Gracefully degrade to an empty list of cooperators
    if not response.ok:
        app.logger.debug(
            '%s from %s (reason: %s). Treating as zero cooperators...',
            response.status_code,
            response.url,
            response.reason
        )
        return []

    return response.json().get('Customers', [])
