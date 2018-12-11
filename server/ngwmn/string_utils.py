"""
utility functions for the manipulation of strings

"""


def generate_subtitle(features):
    """
    logic to create subtitle -- which could also be called the 'monitoring location description'
    :param features: python dictionary with features of the selected monitoring location
    :return subtitle: the final subtitle string ready for display
    """
    site_type = features.get('SITE_TYPE')
    aquifer_description = features.get('NAT_AQFR_DESC')
    county = features.get('COUNTY_NM')
    state = features.get('STATE_NM')

    subtitle = ''

    if site_type or aquifer_description:
        if state:
            if county:
                subtitle = 'Located in ' + county + ', ' + state + ', this '
            else:
                subtitle = 'Located in ' + state + ', this '
        else:
            subtitle = 'This '

        if site_type:
            subtitle = subtitle + 'groundwater monitoring location is associated with a '
            if site_type == 'WELL':
                subtitle = subtitle + 'water ' + site_type.lower()
            else:
                subtitle = subtitle + site_type.lower()

            if aquifer_description:
                subtitle = subtitle + ' in the ' + aquifer_description

        elif aquifer_description:
            subtitle = subtitle + 'groundwater monitoring location is in the ' + aquifer_description

        subtitle = subtitle + '.'

    elif state:
        subtitle = 'This groundwater monitoring location is in '
        if county:
            subtitle = subtitle + county + ', ' + state
        else:
            subtitle = subtitle + state

        subtitle = subtitle + '.'
    return subtitle
