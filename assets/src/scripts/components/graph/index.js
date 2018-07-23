import { select } from 'd3-selection';
import { createStructuredSelector } from 'reselect';

import { link, provide } from 'ngwmn/lib/d3-redux';
import { getWaterLevels, retrieveWaterLevels } from 'ngwmn/services/state/index';

import {
    getAxisX, getAxisY, getCurrentWaterLevelUnit, getLayout, setLayout,
    setOptions
} from './state';


const drawAxisX = function (elem, {axisX, layout}) {
    elem.selectAll('.x-axis').remove();
    elem.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${layout.height})`)
        .call(axisX);
};

const drawAxisY = function (elem, {axisY}) {
    elem.selectAll('.y-axis').remove();
    elem.append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(0, 0)')
        .call(axisY);
};

const drawAxisYLabel = function (elem, {unit}, label) {
    // Create a span for the label, if it doesn't already exist
    label = label || elem.append('span')
        .classed('y-label', true);

    // Set the label text
    if (unit) {
        label.text(`Water levels, ${unit}`);
    } else {
        label.text('Water levels');
    }

    return label;
};

const drawGraph = function (elem) {
    elem.append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .classed('chart', true)
        .call(link(drawAxisX, createStructuredSelector({
            axisX: getAxisX,
            layout: getLayout
        })))
        .call(link(drawAxisY, createStructuredSelector({
            axisY: getAxisY
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
        .call(link(drawAxisYLabel, createStructuredSelector({
            unit: getCurrentWaterLevelUnit
        })))
        .call(drawGraph);

    window.onresize = function () {
        store.dispatch(setLayout({width: node.offsetWidth, height: node.offsetHeight}));
    };
}
