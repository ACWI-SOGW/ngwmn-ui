"""
Unit tests for string manipulation functions
"""

from unittest import TestCase

from ..string_utils import generate_subtitle


class TestGenerateSubtitle(TestCase):
    def setUp(self):
        self.features_all = {'STATE_NM': 'Wisconsin',
                             'COUNTY_NM': 'Dane County',
                             'SITE_TYPE': 'WELL',
                             'NAT_AQFR_DESC': 'cambrian ordovician aquifer system'}
        self.features_site_type_not_well = {'STATE_NM': 'Wisconsin',
                                            'COUNTY_NM': 'Dane County',
                                            'SITE_TYPE': 'something that is not a well',
                                            'NAT_AQFR_DESC': 'cambrian ordovician aquifer system'}
        self.features_no_state = {'COUNTY_NM': 'Dane County',
                                  'SITE_TYPE': 'WELL',
                                  'NAT_AQFR_DESC': 'cambrian ordovician aquifer system'}
        self.feature_no_county = {'STATE_NM': 'Wisconsin',
                                  'SITE_TYPE': 'WELL',
                                  'NAT_AQFR_DESC': 'cambrian ordovician aquifer system'}

    def test_all_features_present(self):
        result = generate_subtitle(self.features_all)
        self.assertEqual('Located in Dane County, Wisconsin, this groundwater monitoring location is associated with '
                         'a water well in the cambrian ordovician aquifer system.',
                         result, 'Result not as expected when site, state, county, and aquifer are in features.')

    def test_site_type_not_well(self):
        result = generate_subtitle(self.features_site_type_not_well)
        self.assertEqual('Located in Dane County, Wisconsin, this groundwater monitoring location is associated with a'
                         ' something that is not a well in the cambrian ordovician aquifer system.',
                         result, 'Result not as expected when site type is something other than a well')

    def test_no_state_in_features(self):
        result = generate_subtitle(self.features_no_state)
        self.assertEqual('This groundwater monitoring location is associated with a water well in'
                         ' the cambrian ordovician aquifer system.',
                         result, 'Result not as expected when state name NOT in features.')

    def test_no_county_in_features(self):
        result = generate_subtitle(self.feature_no_county)
        self.assertEqual('Located in Wisconsin, this groundwater monitoring location is associated with a water well'
                         ' in the cambrian ordovician aquifer system.',
                         result, 'Result not as expected when county name NOT in features')
