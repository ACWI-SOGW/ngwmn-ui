import { select } from 'd3-selection';
import { createStructuredSelector } from 'reselect';

import { link, provide } from 'ngwmn/lib/d3-redux';
import { getWaterLevels, retrieveWaterLevels } from 'ngwmn/services/state/index';

import { getAxisX, getAxisY, getLayout, setLayout, setOptions } from './state';


/**
 * Appends the x and y axes to the given svg node.
 */
const drawAxes = function (elem, {axisX, axisY, layout}) {
    const xLoc = {
        x: 0,
        y: layout.height
    };
    const yLoc = {x: 0, y: 0};

    // Remove existing axes before adding the new ones.
    elem.selectAll('.x-axis, .y-axis').remove();

    // Add x-axis
    elem.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${xLoc.x}, ${xLoc.y})`)
        .call(axisX);

    // Add y-axis and a text label
    elem.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${yLoc.x}, ${yLoc.y})`)
        .call(axisY);
};

const drawGraph = function (elem) {
    elem.append('span')
        .classed('y-label', true)
        .text('y-axis label');

    elem.append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .classed('chart', true)
        .call(link(drawAxes, createStructuredSelector({
            axisX: getAxisX,
            axisY: getAxisY,
            layout: getLayout
        })))
        .append('text')
            .attr('x', 50)
            .attr('y', 50)
            .text('Graph goes here');
};

const drawMessage = function(elem, message) {
    elem.append('div')
        .attr('class', 'usa-alert usa-alert-warning')
        .append('div')
            .attr('class', 'usa-alert-body')
            .call(div => {
                div.append('h3')
                    .attr('class', 'usa-alert-heading')
                    .html('Alert');
                div.append('p')
                    .html(message);
            });
};

export default function (store, node, options = {}) {
    const { agencycode, siteid } = options;

    if (!siteid) {
        select(node).call(drawMessage, 'No data is available.');
        return;
    }

    store.dispatch(setLayout({width: node.offsetWidth, height: node.offsetHeight}));
    store.dispatch(setOptions(options));
    store.dispatch(retrieveWaterLevels(agencycode, siteid));

    select(node)
        .call(provide(store))
        .call(link((elem, waterLevels) => {
            elem.classed('loading', !waterLevels)
                .classed('has-error', waterLevels && waterLevels.error);
        }, getWaterLevels))
        .call(drawGraph);

    window.onresize = function () {
        store.dispatch(setLayout({width: node.offsetWidth, height: node.offsetHeight}));
    };
}
