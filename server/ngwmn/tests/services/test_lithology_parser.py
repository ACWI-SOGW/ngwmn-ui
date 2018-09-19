"""
Tests for lithology string parsing.
"""

import os

import webcolors

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


def test_get_colors():
    test = lithology_parser.get_colors(['red', 'sdf', 'orange', 'asdf'])
    assert set(test) == set([
        webcolors.CSS3_NAMES_TO_HEX['red'],
        webcolors.CSS3_NAMES_TO_HEX['orange']
    ]), 'Expected red and orange'
    test = lithology_parser.get_colors([])
    assert test == [], 'expected empty array'
