"""
Tests for lithology string parsing.
"""

import os

from ngwmn.services import lithology_parser


def test_classify_material():
    scores = []
    materials_txt = os.path.join(os.path.dirname(__file__), 'materials.txt')
    with open(materials_txt) as file:
        for index, material in enumerate(file):
            # To speed up the test, only test every 200th material
            if index % 200:
                continue
            test = lithology_parser.classify_material(material)
            scores.append(test)

    # Assert that every string returns a match
    count = len([score for score in filter(len, scores)])
    assert count == len(scores)
