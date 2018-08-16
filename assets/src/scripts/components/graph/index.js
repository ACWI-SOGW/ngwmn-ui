import { select } from 'd3-selection';

import { link } from 'ngwmn/lib/d3-redux';
import { retrieveWaterLevels } from 'ngwmn/services/state/index';

import { getCurrentWaterLevels, setGraphOptions } from './state';
import drawGraph from './view';


/**
 * Draws a message into an alert div
 * @param  {Object} elem    D3 selector
 * @param  {String} message Message to display
 */
export const drawMessage = function (elem, message) {
    elem.append('div')
        .attr('class', 'usa-alert usa-alert-warning')
        .append('div')
            .attr('class', 'usa-alert-body')
            .call(div => {
                div.append('h3')
                    .attr('class', 'usa-alert-heading')
                    .html('Alert');
                div.append('p')
                    .classed('message', true)
                    .html(message);
            });
};

/**
 * Draws a water-levels graph.
 * @param  {Object} store   Redux store
 * @param  {Object} node    DOM node to draw graph into
 * @param  {Object} options {agencycode, siteid} of site to draw
 */
export default function (store, node, options = {}) {
    const { agencycode, siteid } = options;

    if (!siteid || !agencycode) {
        select(node).call(drawMessage, 'Invalid arguments.');
        return;
    }

    store.dispatch(setGraphOptions(options));
    store.dispatch(retrieveWaterLevels(agencycode, siteid));

    select(node)
        .call(link(store, (elem, waterLevels) => {
            elem.classed('loading', !waterLevels || !waterLevels.samples)
                .classed('has-error', waterLevels && waterLevels.error);
        }, getCurrentWaterLevels))
        .call(drawGraph, store);
}
