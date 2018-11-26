import { select } from 'd3-selection';

import { link } from 'ngwmn/lib/d3-redux';
import {
    getSiteKey, getWaterLevelStatus, setWellLog, retrieveWaterLevels
} from 'ngwmn/services/state/index';

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
 * Draws a water-levels or well log graph.
 * @param  {Object} store               Redux store
 * @param  {Object} node                DOM node to draw graph into
 * @param  {Object} options.graphType   'water-levels' or 'well-log'
 * @param  {Object} options.agencyCode  Agency of site to draw
 * @param  {Object} options.siteId      ID of site to draw
 * @param  {String} options.id          Unique ID for this component
 */
export default function (store, node, options) {
    const { agencyCode, siteId } = options;

    if (!siteId || !agencyCode) {
        select(node).call(drawMessage, 'Invalid arguments.');
        return;
    }

    store.dispatch(setWellLog(agencyCode, siteId, window.wellLog));

    // If a request for this site hasn't been made yet, make the water levels
    // service call.
    if (!getWaterLevelStatus(agencyCode, siteId)(store.getState())) {
        store.dispatch(retrieveWaterLevels(agencyCode, siteId));
    }

    const opts = {
        siteKey: getSiteKey(options.agencyCode, options.siteId),
        ...options
    };

    select(node)
        .call(link(store, (elem, waterLevels, overlay) => {
            elem.classed('loading', !waterLevels || !waterLevels.samples)
                .classed('has-error', waterLevels && waterLevels.error);

            if (options.graphType === 'water-levels') {
                overlay = overlay || elem
                    .append('div')
                        .classed('overlay', true);
                overlay.text(waterLevels.message || '');
            }

            return overlay;
        }, getCurrentWaterLevels(opts)))
        .call(drawGraph(opts), store);
}
