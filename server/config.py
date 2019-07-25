"""
Application configuration settings

"""
DEBUG = False

SERVICE_ROOT = 'https://cida.usgs.gov'
STATS_SERVICE_ROOT = 'http://cida.usgs.gov/ngwmn_statistics'


CONFLUENCE_URL = 'https://my.usgs.gov/confluence/'

# URL pattern for retrieving SIFTA cooperator logos
COOPERATOR_SERVICE_PATTERN = 'https://sifta.water.usgs.gov/Services/REST/Site/CustomerFunding.ashx?SiteNumber={site_no}&StartDate=10/1/2016&EndDate=09/30/2017'
