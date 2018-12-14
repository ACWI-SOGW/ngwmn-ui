"""
utility functions for the manipulation of strings

"""


def generate_subtitle(features):
    """
    logic to create subtitle (the 'monitoring location description')
    :param features: python dictionary with features of the selected monitoring location
    :return subtitle: the final subtitle string ready for display
    """
    site_type = features.get('SITE_TYPE')
    aquifer_description = features.get('NAT_AQFR_DESC')
    county = features.get('COUNTY_NM')
    state = features.get('STATE_NM')

    # In some records the state name is blank, so check that the state name is there (also check if the county name
    # is there. If not, adjust for that)
    if state:
        start_of_description = 'Located in {0}, {1}, this '.format(county, state) if county\
            else 'Located in {0}, this '.format(state)
    # If the state name is blank, start the sentence in a sensible manner
    else:
        start_of_description = 'This '

    end_of_description = 'groundwater monitoring location is associated with a '
    # Check if the site type is 'WELL' if it is, add the word water, else don't
    end_of_description = '{0}water {1}'.format(end_of_description, site_type.lower()) if site_type == 'WELL' \
        else '{0}{1}'.format(end_of_description, site_type.lower())

    # Add the Nation Aquifer description to end of the description
    end_of_description = '{0} in the {1}'.format(end_of_description, aquifer_description)

    subtitle = '{0}{1}.'.format(start_of_description, end_of_description)

    return subtitle
