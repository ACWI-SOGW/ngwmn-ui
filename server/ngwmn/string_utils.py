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

    intro_clause = ''
    main_clause = ''
    closing_period = ''

    if site_type or aquifer_description:
        only_state_in_features = False

        if state:
            intro_clause = generate_intro_clause(state, county, only_state_in_features)
        main_clause = generate_main_clause(state, site_type, aquifer_description)

    elif state:
        only_state_in_features = True
        intro_clause = generate_intro_clause(state, county, only_state_in_features)

    if site_type or aquifer_description or state:
        closing_period = '.'

    subtitle = '{0}{1}{2}'.format(intro_clause, main_clause, closing_period)
    return subtitle


def generate_intro_clause(state, county, only_state_in_features):
    """
    Creates the section of the monitoring location description that denotes the state and possibly county
    :param state: string, name of the state where the monitoring location is found
    :param county: string, name of the county if available
    :param only_state_in_features: boolean, if the name of state
    :return state_clause: string, section of the monitoring location description that lists the state and possibly
            county names
    """
    if only_state_in_features:
        clause_start = 'This groundwater monitoring location is in '
        clause_end = county + ', ' + state if county else state

    else:
        clause_start = 'Located in ' + county + ', ' + state if county else 'Located in ' + state
        clause_end = ', this '

    state_clause = '{0}{1}'.format(clause_start, clause_end)

    return state_clause


def generate_main_clause(state, site_type, aquifer_description):
    """
    Creates the section of the monitoring location description denoting the site type and aquifer
    :param state: string, name of the state where the monitoring location is found, used as a boolean test
    :param site_type: string, type of location, usually a well or spring
    :param aquifer_description: string, the name of the aquifer in which the monitoring location is found
    :return site_type_clause: string, the section of the monitoring location description denoting
            the site type and aquifer
    """
    site_type_clause = ''

    if not state:
        site_type_clause = 'This '

    if site_type:
        site_type_clause = '{0}groundwater monitoring location is associated with a '.format(site_type_clause)
        site_type_clause = \
            '{0}water {1}'.format(site_type_clause, site_type.lower()) if site_type == 'WELL' else '{0}{1}'\
            .format(site_type_clause, site_type.lower())

        if aquifer_description:
            site_type_clause = '{0} in the {1}'.format(site_type_clause, aquifer_description)

    elif aquifer_description:
        site_type_clause = '{0}groundwater monitoring location is in the {1}'.format(site_type_clause,
                                                                                     aquifer_description)
    return site_type_clause
