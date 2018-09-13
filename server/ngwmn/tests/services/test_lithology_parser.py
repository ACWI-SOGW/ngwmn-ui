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
            # To speed up the test, only test every 50th material
            if index % 50:
                continue
            test = lithology_parser.classify_material(material)
            scores.append(test)

    # This is arbitrary - assert that no fewer than 1% of the tested materials
    # return an empty list of materials.
    count = len([score for score in filter(len, scores)])
    assert count > len(scores) * 0.99
