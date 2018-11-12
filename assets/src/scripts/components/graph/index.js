import { select } from 'd3-selection';

import { link } from 'ngwmn/lib/d3-redux';
import { getSiteKey, setWellLog, retrieveWaterLevels } from 'ngwmn/services/state/index';

import { getCurrentWaterLevels } from './state';
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
 * @param  {Object} options {agencyCode, siteId} of site to draw
 */
export default function (store, node, options) {
    const { agencyCode, siteId } = options;

    if (!siteId || !agencyCode) {
        select(node).call(drawMessage, 'Invalid arguments.');
        return;
    }

    store.dispatch(setWellLog(agencyCode, siteId, window.wellLog));
    store.dispatch(retrieveWaterLevels(agencyCode, siteId));

    const opts = {
        siteKey: getSiteKey(options.agencyCode, options.siteId),
        ...options
    };

    select(node)
        .call(link(store, (elem, waterLevels) => {
            elem.classed('loading', !waterLevels || !waterLevels.samples)
                .classed('has-error', waterLevels && waterLevels.error);
        }, getCurrentWaterLevels(opts)))
        .call(drawGraph(opts), store);
}
