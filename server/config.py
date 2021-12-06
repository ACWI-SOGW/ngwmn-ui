"""
Application configuration settings

"""
DEBUG = False

# TODO these are hard coded configurations and should be loaded from a resource provider

SERVICE_ROOT = 'https://cida.usgs.gov'
STATS_SERVICE_ROOT = 'http://cida.usgs.gov/ngwmn_statistics'

CONFLUENCE_URL = 'http://ngwmn-prod.cr.usgs.gov:8080/ngwmn-remote-content/content/'

STATISTICS_METHODS_URL = CONFLUENCE_URL + 'ngwmn-stat-meth'

# URL pattern for retrieving SIFTA cooperator logos
COOPERATOR_SERVICE_PATTERN = 'https://water.usgs.gov/customer/stories/{site_no}&StartDate=10/1/{year}&EndDate={current_date}'
