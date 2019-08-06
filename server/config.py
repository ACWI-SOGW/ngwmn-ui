"""
Application configuration settings

"""
DEBUG = False

SERVICE_ROOT = 'https://cida.usgs.gov'
STATS_SERVICE_ROOT = 'http://cida.usgs.gov/ngwmn_statistics'

CONFLUENCE_URL = 'https://my.usgs.gov/confluence/'

STATISTICS_METHODS_URL = CONFLUENCE_URL + 'createrssfeed.action?types=page&spaces=GWDataPortal&title' \
                         '=NGWMN+Statistics+Methods&labelString=ngwmn-stat-meth&excludedSpaceKeys%3D&sort=modified' \
                         '&maxResults=10&timeSpan=5000&showContent=true&confirm=Create+RSS+Feed '

# URL pattern for retrieving SIFTA cooperator logos
COOPERATOR_SERVICE_PATTERN = 'https://sifta.water.usgs.gov/Services/REST/Site/CustomerFunding.ashx?SiteNumber={site_no}&StartDate=10/1/2016&EndDate=09/30/2017'
