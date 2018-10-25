"""
Application configuration settings

"""
DEBUG = False

SERVICE_ROOT = 'https://cida.usgs.gov'
# ngwmn_cache service root happens to be the same as the ngwmn root, but does not have to be
SERVICE_ROOT_CACHE = SERVICE_ROOT

# URL pattern for retrieving SIFTA cooperator logos
#COOPERATOR_SERVICE_PATTERN = 'https://water.usgs.gov/customer/stories/{site_no}/approved.json'
COOPERATOR_SERVICE_PATTERN = 'https://sifta.water.usgs.gov/Services/REST/Site/CustomerFunding.ashx?SiteNumber={site_no}&StartDate=10/1/2016&EndDate=09/30/2017'
