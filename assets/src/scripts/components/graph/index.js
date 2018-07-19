import { select } from 'd3-selection';

import { link, provide } from 'ngwmn/lib/d3-redux';
import { retrieveWaterLevels } from 'ngwmn/services/duck/operations';
import { getWaterLevels } from 'ngwmn/services/duck/selectors';


const drawGraph = function (elem) {
    elem.append('span')
        .classed('y-label', true)
        .text('y-axis label');
    elem.append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .classed('chart', true)
        .append('text')
            .attr('x', 50)
            .attr('y', 50)
            .text('Graph goes here');
};


const drawMessage = function(elem, message) {
    // Set up parent element and SVG
    elem.innerHTML = '';
    const alertBox = elem
        .append('div')
            .attr('class', 'usa-alert usa-alert-warning')
            .append('div')
                .attr('class', 'usa-alert-body');
    alertBox
        .append('h3')
            .attr('class', 'usa-alert-heading')
            .html('Alert');
    alertBox
        .append('p')
            .html(message);
};


export default function (store, node, {agencycode, siteid} = {}) {
    if (!siteid) {
        select(node).call(drawMessage, 'No data is available.');
        return;
    }

    store.dispatch(retrieveWaterLevels(agencycode, siteid));

    select(node)
        .call(provide(store))
        .call(link((elem, waterLevels) => {
            elem.classed('loading', !waterLevels)
                .classed('has-error', waterLevels && waterLevels.error);
        }, getWaterLevels))
        .call(drawGraph);
}
