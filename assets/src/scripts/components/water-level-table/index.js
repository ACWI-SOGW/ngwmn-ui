/* global List */

import { select } from 'd3-selection';
import { createStructuredSelector } from 'reselect';

import { link } from 'ngwmn/lib/d3-redux';
import { getSiteWaterLevels} from 'ngwmn/services/state/index';

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

const drawTableBody = function(table, waterLevels) {
    const samples = waterLevels.samples || [];
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
    console.log('Item is ' + item);
    new List('water-levels-div', options, samples);
};
/*
 * Renders the water level table
 *  * @param  {Object} store   Redux store
 * @param  {Object} node    DOM node to draw graph into
 */
export default function(store, node, {agencycd, siteid}) {
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
            .data(COLUMN_HEADINGS).enter()
            .append('th')
                .text((col) => col);
    table.append('tbody')
        .classed('list', true);

    table.call(link(store, (elem, {isRendered, waterLevels}) => {
        // Add code to rendered
        if (isRendered) {
            drawTableBody(elem, waterLevels);
        }
    }, createStructuredSelector({
        isRendered: isTableRendered,
        waterLevels: getSiteWaterLevels(agencycd, siteid)
    })));
}