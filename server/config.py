"""
Application configuration settings

"""
DEBUG = False

SERVICE_ROOT = 'https://cida.usgs.gov'
STATS_SERVICE_ROOT = 'http://cida.usgs.gov/ngwmn_statistics'

# TODO this will be revised to be loaded from configuration
CONFLUENCE_URL = 'http://ngwmn-dev.cr.usgs.gov:8080/ngwmn-remote-content/content/'

STATISTICS_METHODS_URL = CONFLUENCE_URL + 'ngwmn-stat-meth'

# URL pattern for retrieving SIFTA cooperator logos
COOPERATOR_SERVICE_PATTERN = 'https://water.usgs.gov/customer/stories/{site_no}&StartDate=10/1/{year}&EndDate={current_date}'
