from difflib import SequenceMatcher
from functools import cmp_to_key
import re

import webcolors


# Standard lithologic pattern strings
# https://pubs.usgs.gov/tm/2006/11A02/ (Section 37)
LITHOLOGY = {
    # Gravel or conglomerate (1st option):
    601: {('gravel',), ('conglomerate',)},
    # Gravel or conglomerate (2nd option):
    #602: {('gravel',), ('conglomerate',)},
    # Crossbedded gravel or conglomerate:
    603: {('crossbedded', 'gravel',), ('conglomerate',)},
    # Breccia (1st option):
    605: {('breccia',)},
    # Breccia (2nd option):
    #606: {('breccia',)},
    # Massive sand or sandstone:
    607: {('massive', 'sand',), ('sandstone',)},
    # Bedded sand or sandstone:
    608: {('bedded', 'sand',), ('sandstone',)},
    # Crossbedded sand or sandstone (1st option):
    609: {('crossbedded', 'sand',), ('sandstone',)},
    # Crossbedded sand or sandstone (2nd option):
    #610: {('crossbedded', 'sand',), ('sandstone',)},
    # Ripple-bedded sand or sandstone:
    611: {('ripple-bedded', 'sand',), ('ripple-bedded', 'sandstone',)},
    # Argillaceous or shaly sandstone:
    612: {('argillaceous',), ('shaly', 'sandstone',)},
    # Calcareous sandstone:
    613: {('calcareous', 'sandstone',)},
    # Dolomitic sandstone:
    614: {('dolomitic', 'sandstone',)},
    # Silt, siltstone, or shaly silt:
    616: {('silt',), ('siltstone',), ('shaly', 'silt',)},
    # Calcareous siltstone:
    617: {('calcareous', 'siltstone',)},
    # Dolomitic siltstone:
    618: {('dolomitic', 'siltstone',)},
    # Sandy or silty shale:
    619: {('sandy', 'shale'), ('silty', 'shale',)},
    # Clay or clay shale:
    620: {('clay',), ('clay', 'shale',)},
    # Cherty shale:
    621: {('cherty', 'shale',)},
    # Dolomitic shale:
    622: {('dolomitic', 'shale',)},
    # Calcareous shale or marl:
    623: {('calcareous', 'shale',), ('marl',)},
    # Carbonaceous shale:
    624: {('carbonaceous', 'shale',)},
    # Oil shale:
    625: {('oil', 'shale',)},
    # Chalk:
    626: {('chalk',)},
    # Limestone:
    627: {('limestone',)},
    # Clastic limestone:
    628: {('clastic', 'limestone',)},
    # Fossiliferous clastic limestone:
    629: {('fossiliferous', 'clastic', 'limestone',)},
    # Nodular or irregularly bedded limestone:
    630: {('nodular', 'bedded', 'limestone',), ('irregularly', 'bedded', 'limestone',)},
    # Limestone, irregular (burrow?) fillings of saccharoidal dolomite:
    631: {('limestone', 'irregular', 'burrow', 'fillings', 'saccharoidal', 'dolomite',)},
    # Crossbedded limestone:
    632: {('crossbedded', 'limestone',)},
    # Cherty crossbedded limestone:
    633: {('cherty', 'crossbedded', 'limestone',)},
    # Cherty and sandy crossbedded clastic limestone:
    634: {('cherty', 'sandy', 'crossbedded', 'clastic', 'limestone',)},
    # Oolitic limestone:
    635: {('oolitic', 'limestone',)},
    # Sandy limestone:
    636: {('sandy', 'limestone',)},
    # Silty limestone:
    637: {('silty', 'limestone',)},
    # Argillaceous or shaly limestone:
    638: {('argillaceous', 'limestone',), ('shaly', 'limestone',)},
    # Cherty limestone (1st option):
    639: {('cherty', 'limestone',)},
    # Cherty limestone (2nd option):
    #640: {('cherty', 'limestone',)},
    # Dolomitic limestone, limy dolostone, or limy dolomite:
    641: {('dolomitic', 'limestone',), ('limy', 'dolostone',), ('limy', 'dolomite',)},
    # Dolostone or dolomite:
    642: {('dolostone',), ('dolomite',)},
    # Crossbedded dolostone or dolomite:
    643: {('crossbedded', 'dolostone',), ('crossbedded', 'dolomite',)},
    # Oolitic dolostone or dolomite:
    644: {('oolitic', 'dolostone',), ('oolitic', 'dolomite',)},
    # Sandy dolostone or dolomite:
    645: {('sandy', 'dolostone',), ('sandy', 'dolomite',)},
    # Silty dolostone or dolomite:
    646: {('silty', 'dolostone',), ('silty', 'dolomite',)},
    # Argillaceous or shaly dolostone or dolomite:
    647: {('argillaceous', 'dolostone',), ('argillaceous', 'dolomite',), ('shaly', 'dolostone',), ('shaly', 'dolomite',)},
    # Cherty dolostone or dolomite:
    648: {('cherty', 'dolostone',), ('cherty', 'dolomite',)},
    # Bedded chert (1st option):
    649: {('bedded', 'chert',)},
    # Bedded chert (2nd option):
    #650: {('bedded', 'chert',)},
    # Fossiliferous bedded chert:
    651: {('fossiliferous', 'bedded', 'chert',)},
    # Fossiliferous rock:
    652: {('fossiliferous', 'rock',)},
    # Diatomaceous rock:
    653: {('diatomaceous', 'rock',)},
    # Subgraywacke:
    654: {('subgraywacke',)},
    # Crossbedded subgraywacke:
    655: {('crossbedded', 'subgraywacke',)},
    # Ripple-bedded subgraywacke:
    656: {('ripple-subgraywacke',)},
    # Peat:
    657: {('peat',)},
    # Coal:
    658: {('coal',)},
    # Bony coal or impure coal:
    659: {('bony', 'coal',), ('impure', 'coal',)},
    # Underclay:
    660: {('underclay',)},
    # Flint clay:
    661: {('flint', 'clay',)},
    # Bentonite:
    662: {('bentonite',)},
    # Glauconite:
    663: {('glauconite',)},
    # Limonite:
    664: {('limonite',)},
    # Siderite:
    665: {('siderite',)},
    # Phosphatic-nodular rock:
    666: {('phosphatic-nodular', 'rock',)},
    # Gypsum:
    667: {('gypsum',)},
    # Salt:
    668: {('salt',)},
    # Interbedded sandstone and siltstone:
    669: {('sandstone', 'siltstone',)},
    # Interbedded sandstone and shale:
    670: {('sandstone', 'shale',)},
    # Interbedded ripplebedded sandstone and shale:
    671: {('ripplebedded', 'sandstone', 'shale',)},
    # Interbedded shale and silty limestone (shale dominant):
    672: {('shale', 'silty', 'limestone',)},
    # Interbedded shale and limestone (shale dominant) (1st option):
    673: {('shale', 'limestone',)},
    # Interbedded shale and limestone (shale dominant) (2nd option):
    #674: {('interbedded', 'shale', 'limestone',)},
    # Interbedded calcareous shale and limestone (shale dominant):
    675: {('calcareous', 'shale', 'limestone',)},
    # Interbedded silty limestone and shale:
    676: {('silty', 'limestone', 'shale',)},
    # Interbedded limestone and shale (1st option):
    677: {('limestone', 'shale',)},
    # Interbedded limestone and shale (2nd option):
    #678: {('interbedded', 'limestone', 'shale',)},
    # Interbedded limestone and shale (limestone dominant):
    679: {('limestone' 'shale',)},
    # Interbedded limestone and calcareous shale:
    680: {('limestone', 'calcareous', 'shale',)},
    # Till or diamicton (1st option):
    681: {('till',), ('diamicton',)},
    # Till or diamicton (2nd option):
    #682: {('till',), ('diamicton',)},
    # Till or diamicton (3rd option):
    #683: {('till',), ('diamicton',)},
    # Loess (1st option):
    684: {('loess',)},
    # Loess (2nd option):
    #685: {('loess',)},
    # Loess (3rd option):
    #686: {('loess',)},
    # Metamorphism:
    701: {('metamorphism',)},
    # Quartzite:
    702: {('quartzite',)},
    # Slate:
    703: {('slate',)},
    # Schistose or gneissoid granite:
    704: {('schistose', 'granite',), ('gneissoid', 'granite',)},
    # Schist:
    705: {('schist',)},
    # Contorted schist:
    706: {('contorted', 'schist',)},
    # Schist and gneiss:
    707: {('schist', 'gneiss',)},
    # Gneiss:
    708: {('gneiss',)},
    # Contorted gneiss:
    709: {('contorted', 'gneiss',)},
    # Soapstone, talc, or serpentinite:
    710: {('soapstone',), ('talc',), ('serpentinite',)},
    # Tuffaceous rock:
    711: {('tuffaceous', 'rock',)},
    # Crystal tuff:
    712: {('crystal', 'tuff',)},
    # Devitrified tuff:
    713: {('devitrified', 'tuff',)},
    # Volcanic breccia and tuff:
    714: {('volcanic', 'breccia', 'tuff',)},
    # Volcanic breccia or agglomerate:
    715: {('volcanic', 'breccia',), ('agglomerate',)},
    # Zeolitic rock:
    716: {('zeolitic', 'rock',)},
    # Basaltic flows:
    717: {('basaltic', 'flows',)},
    # Granite (1st option):
    718: {('granite',)},
    # Granite (2nd option):
    #719: {('granite',)},
    # Banded igneous rock:
    720: {('banded', 'igneous', 'rock',)},
    # Igneous rock (1st option):
    721: {('igneous', 'rock',)},
    # Igneous rock (2nd option):
    #722: {('igneous', 'rock',)},
    # Igneous rock (3rd option):
    #723: {('igneous', 'rock',)},
    # Igneous rock (4th option):
    #724: {('igneous', 'rock',)},
    # Igneous rock (5th option):
    #725: {('igneous', 'rock',)},
    # Igneous rock (6th option):
    #726: {('igneous', 'rock',)},
    # Igneous rock (7th option):
    #727: {('igneous', 'rock',)},
    # Igneous rock (8th option):
    #728: {('igneous', 'rock',)},
    # Porphyritic rock (1st option):
    729: {('porphyritic', 'rock',)},
    # Porphyritic rock (2nd option):
    #730: {('porphyritic', 'rock',)},
    # Vitrophyre:
    731: {('vitrophyre',)},
    # Quartz:
    732: {('quartz',)},
    # Ore:
    733: {('ore',)},
}

LITH_OPTIONS = {
    option: lith_id
    for lith_id, options in LITHOLOGY.items()
    for option in options
}

# Standard, named web colors
COLORS = set(webcolors.CSS3_NAMES_TO_HEX.keys())


# This option does whole-sequence comparison - so doesn't get sub-parts very well
# def _score_material(words):
#     matches = get_close_matches(words, LITH_OPTIONS.keys(), cutoff=0)
#     return matches

def _compare_scores(a, b):
    # a and b are of form: (option, score)

    # If the scores are the same, give preference to the option with a longer
    # length - which should be more "specific".
    if a[1] == b[1]:
        return len(a[0]) - len(b[0])

    return a[1] - b[1]


def classify_material(words, max_matches=5):
    """
    Returns the top-five matching materials defined in LITHOLOGY
    """

    # Check all possibily lithology options, and store in ranked order
    scores = sorted(
        ((option, SequenceMatcher(None, words, option).ratio())
         for option in LITH_OPTIONS.keys()),
        key=cmp_to_key(_compare_scores),
        reverse=True
    )

    # Remove scores of zero
    non_zero = filter(lambda score: scores[1], scores)

    # Return the lithology IDs of the highest-ranked scores, without duplicates
    materials = []
    for match in list(non_zero)[:max_matches]:
        material = LITH_OPTIONS[match[0]]
        if material not in materials:
            materials.append(material)
        if len(materials) == 5:
            break
    return materials


def parse_material(material_string):
    """
    Parse a material string and return a list of possible matching colors and
    standard lithology definitions.
    """
    words = re.findall(r'\w+', material_string.lower() or '')
    return {
        'colors': list(COLORS & set(words)),
        'materials': classify_material(words)
    }
