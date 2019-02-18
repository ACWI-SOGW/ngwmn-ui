
import { select } from 'd3-selection';
import { createStructuredSelector } from 'reselect';

import List from 'list.js';

import { link } from 'ngwmn/lib/d3-redux';
import {
    getSiteWaterLevels,
    getWaterLevelStatus,
    retrieveWaterLevels
} from 'ngwmn/services/state/index';

import { isTableRendered, renderTable } from './state';

const COLUMN_HEADINGS = [
    'Sample Time',
    'Original Value',
    'Original Unit',
    'Accuracy Value',
    'Accuracy Unit',
    'Data Provided by',
    'Depth to water, feet below land surface',
    'Water level in feet relative to NAVD88'
];

/*
 * Draws the waterLevels data into table
 * @param {D3 node} table
 * @param {Array of Object} waterLevels
 * @return {Object} - Return the tbody element for the table
 */
const drawTableBody = function(table, waterLevels, tbody) {
    tbody = tbody || table
        .append('tbody')
        .classed('list', true);
    const samples = (waterLevels.samples || []).reverse();
    const valueNames = ['time', 'originalValue', 'unit', 'accuracyValue', 'accuracyUnit',
            'sourceCode', 'fromLandsurfaceValue', 'fromDatumValue'];
    const item = valueNames.reduce(function(total, name) {
        return `${total}<td class="${name}"></td>`;
    }, '');
    const options = {
        valueNames: valueNames,
        item: `<tr>${item}</tr>`,
        page: 30,
        pagination: true
    };
    new List('water-levels-div', options, samples);

    return tbody;
};
/*
 * Renders the water level table
 * @param  {Object} store               Redux store
 * @param  {Object} node                DOM node to draw graph into
 * @param  {Object} options.agencyCode  Agency of site to draw
 * @param  {Object} options.siteId      ID of site to draw
 * @param  {String} options.id          Unique ID for this component
 */
export default function(store, node, {agencyCode, siteId}) {
    // If a request for this site hasn't been made yet, make the water levels
    // service call.
    if (!getWaterLevelStatus(agencyCode, siteId)(store.getState())) {
        store.dispatch(retrieveWaterLevels(agencyCode, siteId));
    }

    const component = select(node);
    component.select('button').on('click', () => {
        store.dispatch(renderTable());
    });
    const table = component
        .select('#water-levels-div')
        .append('table')
        .attr('id', 'water-levels-table')
        .classed('usa-table', true);
    component.select('#water-levels-div')
        .append('ul')
        .classed('pagination', true);

    table.append('thead')
         .append('tr')
         .selectAll('th')
         .data(COLUMN_HEADINGS)
         .enter()
         .append('th')
         .text((col) => col);

    table.call(link(store, (elem, {isRendered, waterLevels}) => {
        // Add code to rendered
        if (isRendered) {
            drawTableBody(elem, waterLevels);
        }
    }, createStructuredSelector({
        isRendered: isTableRendered,
        waterLevels: getSiteWaterLevels(agencyCode, siteId)
    })));
}
