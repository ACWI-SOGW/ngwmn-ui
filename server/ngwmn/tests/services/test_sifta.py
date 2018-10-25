"""
Tests for the cooperator service calls.
"""

import json

import pytest
import requests
import requests_mock

from ngwmn.services import sifta
from .mock_data import MOCK_SIFTA_RESPONSE

MOCK_CUSTOMER_LIST = json.loads(MOCK_SIFTA_RESPONSE)['Customers']


def test_sifta_response():
    with requests_mock.mock() as req:
        req.get(requests_mock.ANY, text=MOCK_SIFTA_RESPONSE)
        cooperators = sifta.get_cooperators('12345')
        assert cooperators == MOCK_CUSTOMER_LIST


def test_sifta_response_404():
    with requests_mock.mock() as req:
        req.get(requests_mock.ANY, status_code=404)
        cooperators = sifta.get_cooperators('12345')
        assert cooperators == [], 'Expected empty cooperators list on 404'


def test_sifta_request_exception():
    with requests_mock.mock() as req:
        req.get(requests_mock.ANY, exc=requests.RequestException())
        cooperators = sifta.get_cooperators('12345')
        assert cooperators == [], 'Expected empty list on request exception'


def test_sifta_non_request_exception():
    with requests_mock.mock() as req:
        with pytest.raises(Exception, message='Expected Exception to be raised'):
            req.get(requests_mock.ANY, exc=Exception())
            sifta.get_cooperators('12345')
