"""
Functions for accessing information from a confluence RSS feed
"""

from bs4 import BeautifulSoup
import feedparser

from ngwmn import app

def pull_feed(feed_url):
    """
    pull page data from a my.usgs.gov confluence wiki feed
    :param feed_url: the url of the feed, created in confluence feed builder
    :return: the html of the page itself, stripped of header and footer
    """
    app.logger.debug('Parsing content from %s.', feed_url)
    feed = feedparser.parse(feed_url)

    # Process html to remove unwanted mark-up and fix links
    post = ''
    if feed['entries']:
        soup = BeautifulSoup(feed['entries'][0].summary, 'html.parser')

        # Remove edited by paragraph
        soup.p.extract()

        # Remove final div in the feed
        feed_div = soup.find('div', class_='feed')
        children_divs = feed_div.findAll('div')
        children_divs[len(children_divs) - 1].extract()

        # Translate any in page links to use relative URL
        base = feed['entries'][0].summary_detail.base
        links = feed_div.select('a[href^="' + base + '"]')
        for link in links:
            link['href'] = link['href'].replace(base, '')
        post = str(soup)

    elif feed.get('bozo_exception'):
        app.logger.error('Error retrieving feed for {0} with error '.format(feed_url, str(feed.get('bozo_exception'))))
    return post


MAIN_CONTENT = 'main'
SITE_SELECTION_CONTENT = 'siteselect'
DATA_COLLECTION_CONTENT = 'datacollection'
DATA_MANAGEMENT_CONTENT = 'datamanagement'
OTHER_AGENCY_INFO_CONTENT = 'otherinfo'

def confluence_url(agency_cd, content_type):
    """
    Return confluence url containing information for the agency and content type
    :param str agency_cd:
    :param str content_type:
    :rtype str
    """
    return '{0}createrssfeed.action?types=page&spaces=GWDataPortal&title=X&labelString=ngwmn_provider_{1}_{2}&amp;excludedSpaceKeys%3D&sort=modified&maxResults=10&timeSpan=3600&showContent=true&confirm=Create+RSS+Feed'.format(
        app.config['CONFLUENCE_URL'],
        agency_cd,
        content_type
    )

