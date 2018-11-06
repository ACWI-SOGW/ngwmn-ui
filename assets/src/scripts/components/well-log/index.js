import { select } from 'd3-selection';

import { link } from 'ngwmn/lib/d3-redux';
import {
    getSelectedConstructionIndex, setSelectedConstructionIndex,
    setVisibleConstructionIndices
} from './state';


const updateVisibleIndices = function (store, elem) {
    const indices = elem
        .selectAll('tbody tr')
            .nodes()
            .filter(node => node.offsetParent)
            .map(node => Number.parseInt(node.dataset.constructionindex));
    store.dispatch(setVisibleConstructionIndices(indices));
};

/**
 * Component that adds interactivity to a table of well construction
 * information.
 * @param  {Object} store Redux store
 * @param  {Object} node  DOM node to attach to
 */
export default function (store, node) {
    select(node)
        // Initialize visible indices from the DOM
        .call((elem) => updateVisibleIndices(store, elem))
        // Toggle "selected" class on state change.
        .call(link(store, (elem, selectedIndex) => {
            elem.select('.selected')
                .classed('selected', false);
            elem.select(`[data-constructionindex="${selectedIndex}"]`)
                .classed('selected', true);
        }, getSelectedConstructionIndex))
        // Visible construction indices on checkbox click
        .call((elem) => {
            elem.selectAll('input')
                .on('click', function () {
                    updateVisibleIndices(store, elem);
                });
        })
        // Clear selection on mouse exit
        .on('mouseout', function () {
            store.dispatch(setSelectedConstructionIndex(null));
        })
        // On click, store the selected row in state.
        .selectAll('tbody tr')
            .on('mouseover', function () {
                store.dispatch(setSelectedConstructionIndex(this.dataset.constructionindex));
            });
}
