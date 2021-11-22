"""
Unit tests for services.confluence module
"""

from unittest import TestCase, mock
from config import CONFLUENCE_URL
import requests_mock

from ngwmn.services.confluence import requests, pull_feed, confluence_url


class TestPullFeed(TestCase):

    def test_bad_url(self):
        expect = ''
        with requests_mock.Mocker() as mock_request:
            mock_request.get(MOCK_URL, text=MOCK_PAGE)
            actual = pull_feed('http:fakeserver.com')
        # should return the empty string if the server has an error
        self.assertEqual(expect, actual)

    @mock.patch('ngwmn.services.confluence.requests')
    def test_mock_good_url(self, mock_request):
        expect = MOCK_PAGE
        mock_request.get.return_value = MOCK_RESPONSE()
        actual = pull_feed('http:fakeserver.com')
        # should return the mock page if from the server (mocked up)
        self.assertEqual(expect, actual)


class TestConfluenceUrl(TestCase):

    def test_for_label_string(self):
        expect_start = CONFLUENCE_URL
        expect_ending = "/ABCDE/mycontent"
        actual = confluence_url('ABCDE', 'mycontent')
        # should return a url of the proper form
        self.assertTrue(actual.startswith(expect_start))
        self.assertIn(expect_ending, actual)


MOCK_URL = 'http:fakeserver.com'

MOCK_PAGE = '<html><head></head><body>invalid-provider is not a valid agency code</body></html>'


class MOCK_RESPONSE:
    text = MOCK_PAGE
