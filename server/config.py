"""
Application configuration settings

"""
DEBUG = False

# TODO these are hard coded configurations and should be loaded from a resource provider

SERVICE_ROOT = 'https://cida.usgs.gov'
STATS_SERVICE_ROOT = 'http://cida.usgs.gov/ngwmn_statistics'
CONFLUENCE_URL = 'place holder - see dev tier for workspace value'
STATISTICS_METHODS_URL = 'place holder - see dev tier for workspace value'
# URL pattern for retrieving SIFTA cooperator logos
COOPERATOR_SERVICE_PATTERN = 'https://water.usgs.gov/customer/stories/{site_no}&StartDate=10/1/{year}&EndDate={current_date}'
