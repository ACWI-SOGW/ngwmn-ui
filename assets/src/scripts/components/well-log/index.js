import { select } from 'd3-selection';

import { link } from 'ngwmn/lib/d3-redux';
import { getSiteKey } from '../../services/site-key';
import {
    getSelectedConstructionId, setSelectedConstructionId, setSelectedLithologyId,
    setVisibleConstructionIds} from './state';
import {getSelectedLithologyId} from './state/lithology';


const updateVisibleIds = function (store, elem, siteKey) {
    const ids = elem
        .selectAll('tbody tr')
            .nodes()
            .filter(node => node.offsetParent)
            .map(node => node.dataset.localId);
    store.dispatch(setVisibleConstructionIds(siteKey, ids));
};

/**
 * Component that adds interactivity to a table of well construction
 * information.
 * @param  {Object} store               Redux store
 * @param  {Object} node                DOM node to attach to
 * @param  {Object} options.agencyCode  Agency of site to draw
 * @param  {Object} options.siteId      ID of site to draw
 * @param  {String} options.id          Unique ID for this component
 */
export default function (store, node, options) {
    const siteKey = getSiteKey(options.agencyCode, options.siteId);
    select(node)
        .select('.construction-table')
            // Initialize visible IDs from the DOM
            .call((elem) => updateVisibleIds(store, elem, siteKey))
            // Toggle "selected" class on state change.
            .call(link(store, (elem, selectedId) => {
                elem.select('.selected')
                    .classed('selected', false);
                elem.select(`[data-local-id="${selectedId}"]`)
                    .classed('selected', true);
            }, getSelectedConstructionId(siteKey)))
            // Visible construction IDs on checkbox click
            .call((elem) => {
                elem.selectAll('input')
                    .on('click', function () {
                        updateVisibleIds(store, elem, siteKey);
                    });
            })
            // Clear selection on mouse exit
            .on('mouseout', function () {
                store.dispatch(setSelectedConstructionId(siteKey, null));
            })
            // On click, store the selected row in state.
            .selectAll('tbody tr')
                .on('mouseover', function () {
                    store.dispatch(setSelectedConstructionId(siteKey, this.dataset.localId));
                });
    select(node)
        .select('.lithology-table')
            // Toggle "selected" class on state change.
            .call(link(store, (elem, selectedId) => {
                elem.select('.selected')
                    .classed('selected', false);
                elem.select(`[data-local-id="${selectedId}"]`)
                    .classed('selected', true);
            }, getSelectedLithologyId(siteKey)))
            // Clear selection on mouse exit
            .on('mouseout', function () {
                store.dispatch(setSelectedLithologyId(siteKey, null));
            })
            // On click, store the selected row in state.
            .selectAll('tbody tr')
                .on('mouseover', function () {
                    store.dispatch(setSelectedLithologyId(siteKey, this.dataset.localId));
                });
}


