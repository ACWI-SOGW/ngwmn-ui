"""
Unit tests for services.confluence module
"""

from unittest import TestCase, mock

import feedparser

from ngwmn.services.confluence import pull_feed, confluence_url


class TestPullFeed(TestCase):

    def test_bad_url(self):
        self.assertEqual(pull_feed('http:fakeserver.com'), '')

    @mock.patch('ngwmn.services.confluence.feedparser.parse')
    def test_good_feed(self, m_parse):
        m_parse.return_value = MOCK_FEED
        result = pull_feed('http:fakeserver.com')

        self.assertEqual(result, '<div class="feed"> \n<div style="border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px;">\n<p>Details will be added when the new data provider project is complete.</p>\n</div>\n\n</div>')


class TestConfluenceUrl(TestCase):

    def test_for_label_string(self):
        self.assertIn('labelString=ngwmn_provider_ABCDE_mycontent', confluence_url('ABCDE', 'mycontent'))


MOCK_FEED = feedparser.parse('''<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <title>X</title>
  <link rel="alternate" href="https://my.usgs.gov/confluence" />
  <subtitle>Confluence Syndication Feed</subtitle>
  <id>https://my.usgs.gov/confluence</id>
  <entry>
    <title>MPCA- Site Selection and Classification</title>
    <link rel="alternate" href="https://my.usgs.gov/confluence/display/GWDataPortal/MPCA-+Site+Selection+and+Classification" />
    <category term="ngwmn_provider_mpca_siteselect" />
    <author>
      <name>Pope, Daryll A.</name>
    </author>
    <id>tag:my.usgs.gov,2009:page-607551848-1</id>
    <updated>2018-09-12T19:16:32Z</updated>
    <published>2018-09-12T19:16:32Z</published>
    <summary type="html">&lt;div class="feed"&gt;    &lt;p&gt;
        Page
            &lt;b&gt;added&lt;/b&gt; by
                    &lt;a href="    https://my.usgs.gov/confluence/display/~dpope@usgs.gov
"&gt;Pope, Daryll A.&lt;/a&gt;
            &lt;/p&gt;
        &lt;div style="border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px;"&gt;
        &lt;p&gt;Details will be added when the new data provider project is complete.&lt;/p&gt;
    &lt;/div&gt;
        &lt;div style="padding: 10px 0;"&gt;
       &lt;a href="https://my.usgs.gov/confluence/display/GWDataPortal/MPCA-+Site+Selection+and+Classification"&gt;View Online&lt;/a&gt;
                  &lt;/div&gt;
&lt;/div&gt;</summary>
    <dc:creator>Pope, Daryll A.</dc:creator>
    <dc:date>2018-09-12T19:16:32Z</dc:date>
  </entry>
</feed>''')
