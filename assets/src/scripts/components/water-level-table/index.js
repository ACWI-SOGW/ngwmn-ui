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

const drawTable = function(node, waterLevels, table) {
    table = table || node.append('table')
        .classed('usa-table', true);
    const samples = waterLevels.samples || [];
    const tableData = samples.map((sample) => {
        return [
            sample.time,
            sample.originalValue,
            sample.unit,
            sample.accuracyValue,
            sample.accuracyUnit,
            sample.sourceCode,
            sample.fromLandsurfaceValue,
            sample.fromDatumValue
        ];
    });
    table.append('thead')
        .append('tr')
            .selectAll('th')
            .data(COLUMN_HEADINGS).enter()
            .append('th')
                .text((col) => col);

    const rows = table.append('tbody')
        .selectAll('tr')
        .data(tableData).enter()
        .append('tr');

    rows.selectAll('td')
        .data((row) => row)
        .enter()
        .append('td')
            .text((d) => d);

    return table;
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
    component
        .select('#water-levels-div')
        .call(link(store, (elem, {isRendered, waterLevels}) => {
            // Add code to rendered
            if (isRendered) {
                drawTable(elem, waterLevels);
            }
        }, createStructuredSelector({
            isRendered: isTableRendered,
            waterLevels: getSiteWaterLevels(agencycd, siteid)
        })));
}