"""
Helpers to retrieve SIFTA cooperator data.
"""
import datetime

import requests

from ngwmn import app


def get_current_date():
    """
    A wrapper function to allow unit testing of methods using datetime.date.today
    :return: datetime object for current date
    """
    return datetime.date.today()


def get_cooperators(site_no):
    """
    Gets the cooperator data from the SIFTA service
    :param site_no: USGS site number
    """
    current_date = get_current_date()
    year = current_date.year

    # Only query for providers active in the current wateryear which runs from October 1st through September 30th
    end_of_water_year = datetime.date(year, 9, 30)

    # If the current date is not past the end date for the wateryear, set the wateryear start date to last year.
    if current_date < end_of_water_year:
        year = year - 1

    url = app.config['COOPERATOR_SERVICE_PATTERN'].format(site_no=site_no, year=str(year),
                                                          current_date=current_date.strftime("%m/%d/%Y"))

    try:
        response = requests.get(url)
        app.logger.debug('attempting to contact SIFTA services with this url: %s', url)
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
