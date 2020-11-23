"""
Helpers to retrieve SIFTA cooperator data.
"""
import datetime

import requests

from ngwmn import app


def get_cooperators(site_no):
    """
    Gets the cooperator data from the SIFTA service
    :param site_no: USGS site number
    """

    current_date = datetime.datetime.now()
    year_current = current_date.year
    year_previous = year_current - 1

    url = app.config['COOPERATOR_SERVICE_PATTERN'].format(site_no=site_no, year_previous=year_previous,
                                                          year=year_current)
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
