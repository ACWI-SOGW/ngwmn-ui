import { select } from 'd3-selection';

import { link } from 'ngwmn/lib/d3-redux';
import {
    getSelectedConstructionId, setSelectedConstructionId,
    setVisibleConstructionIds
} from './state';


const updateVisibleIds = function (store, elem) {
    const ids = elem
        .selectAll('tbody tr')
            .nodes()
            .filter(node => node.offsetParent)
            .map(node => node.dataset.localId);
    store.dispatch(setVisibleConstructionIds(ids));
};

/**
 * Component that adds interactivity to a table of well construction
 * information.
 * @param  {Object} store Redux store
 * @param  {Object} node  DOM node to attach to
 */
export default function (store, node) {
    select(node)
        // Initialize visible IDs from the DOM
        .call((elem) => updateVisibleIds(store, elem))
        // Toggle "selected" class on state change.
        .call(link(store, (elem, selectedId) => {
            elem.select('.selected')
                .classed('selected', false);
            elem.select(`[data-local-id="${selectedId}"]`)
                .classed('selected', true);
        }, getSelectedConstructionId))
        // Visible construction IDs on checkbox click
        .call((elem) => {
            elem.selectAll('input')
                .on('click', function () {
                    updateVisibleIds(store, elem);
                });
        })
        // Clear selection on mouse exit
        .on('mouseout', function () {
            store.dispatch(setSelectedConstructionId(null));
        })
        // On click, store the selected row in state.
        .selectAll('tbody tr')
            .on('mouseover', function () {
                store.dispatch(setSelectedConstructionId(this.dataset.localId));
            });
}
