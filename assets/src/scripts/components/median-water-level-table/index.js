import { select } from 'd3-selection';
import { createStructuredSelector } from 'reselect';

import List from 'list.js';

import { link } from '../../lib/d3-redux';
import {
    getSiteMedianWaterLevels,
    getMedianWaterLevelStatus,
    retrieveMedianWaterLevels
} from '../../services/state/index';

import { isTableRendered, renderTable } from './state';

const COLUMN_HEADINGS = [
    'Year',
    'Month',
    'Median'
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
    const samples = waterLevels.medians || [];
    const valueNames = ['year', 'month', 'median'];
    const item = valueNames.reduce(function(total, name) {
        return `${total}<td class="${name}"></td>`;
    }, '');
    const options = {
        valueNames: valueNames,
        item: `<tr>${item}</tr>`,
        page: 30,
        pagination: true
    };
    new List('median-water-levels-div', options, samples);

    return tbody;
};

/*
 * Renders the median water level table
 * @param  {Object} store               Redux store
 * @param  {Object} node                DOM node to draw graph into
 * @param  {Object} options.agencyCode  Agency of site to draw
 * @param  {Object} options.siteId      ID of site to draw
 * @param  {String} options.id          Unique ID for this component
 */
const drawTable = (store, node, agencyCode, siteId) => {
    const component = select(node);
    const table = component
        .select('#median-water-levels-div')
        .append('table')
        .attr('id', 'median-water-levels-table')
        .classed('usa-table', true);
    component.select('#median-water-levels-div')
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
        waterLevels: getSiteMedianWaterLevels(agencyCode, siteId)
    })));
};


/*
 * Checks that data has been fetched.
 * @param  {Object} store               Redux store
 * @param  {Object} node                DOM node to draw graph into
 * @param  {Object} options.agencyCode  Agency of site to draw
 * @param  {Object} options.siteId      ID of site to draw
 * @param  {String} options.id          Unique ID for this component
 */
const ensureDatafetch = (store, node, agencyCode, siteId) => {
    // If a request for this site hasn't been made yet,
    // make the water level service call and render the table elements.
    if (!getMedianWaterLevelStatus(agencyCode, siteId)(store.getState())) {
        store.dispatch(retrieveMedianWaterLevels(agencyCode, siteId));
        drawTable(store, node, agencyCode, siteId);
    }
};

/*
 * Renders the median water level table - on button click
 * @param  {Object} store               Redux store
 * @param  {Object} node                DOM node to draw graph into
 * @param  {Object} options.agencyCode  Agency of site to draw
 * @param  {Object} options.siteId      ID of site to draw
 * @param  {String} options.id          Unique ID for this component
 */
export default function(store, node, {agencyCode, siteId}) {
    const component = select(node);
    component.select('button').on('click', () => {
        ensureDatafetch(store, node, agencyCode, siteId);
        store.dispatch(renderTable());
    });
}