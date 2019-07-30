"""
Application configuration settings

"""
DEBUG = False

SERVICE_ROOT = 'http://cida-eros-ngwmndev.er.usgs.gov:8080'
STATS_SERVICE_ROOT = 'http://cida-eros-ngwmndev.er.usgs.gov:8080/statistics'


CONFLUENCE_URL = 'https://my.usgs.gov/confluence/'

# URL pattern for retrieving SIFTA cooperator logos
COOPERATOR_SERVICE_PATTERN = 'https://sifta.water.usgs.gov/Services/REST/Site/CustomerFunding.ashx?SiteNumber={site_no}&StartDate=10/1/2016&EndDate=09/30/2017'
