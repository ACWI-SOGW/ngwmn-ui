import { select } from 'd3-selection';
import { createStructuredSelector } from 'reselect';

import { link } from 'ngwmn/lib/d3-redux';
import { getWaterLevels } from 'ngwmn/services/state/index';

import { isTableRendered } from 'state';

const HEADINGS = [
    ''
]

const drawTable = function(node, waterLevels, table) {
    table = table || node.append('table')
        .classed('usa-table', true);


    return table;
}
/*
 * Renders the water level table
 *  * @param  {Object} store   Redux store
 * @param  {Object} node    DOM node to draw graph into
 */
export default function(store, node) {
    select(node)
        .call(link(store, (elem, {isRendered, waterLevels}) => {
            // Add code to rendered
            if (isRendered) {
                drawTable(elem, waterLevels);
            }
        }, createStructuredSelector({
            isRendered: isTableRendered,
            waterLevels: getWaterLevels
        })));
};