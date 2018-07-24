import { axisBottom, axisLeft } from 'd3-axis';
import { mouse, select } from 'd3-selection';
import { line as d3Line } from 'd3-shape';
import { timeFormat } from 'd3-time-format';
import { createStructuredSelector } from 'reselect';

import { dispatch, link, provide } from 'ngwmn/lib/d3-redux';
import { initCropper } from 'ngwmn/lib/utils';
import { getWaterLevels, retrieveWaterLevels } from 'ngwmn/services/state/index';

import {
    getCurrentWaterLevelUnit, getCursor, getLayout, getLineSegments, getScaleX,
    getScaleY, setCursor, setLayout, setOptions
} from './state';


const CIRCLE_RADIUS_SINGLE_PT = 1;


const drawDataLine = function(elem, {line, xScale, yScale}) {
    // If this is a single point line, then represent it as a circle.
    // Otherwise, render as a line.
    if (line.points.length === 1) {
        elem.append('circle')
            .data(line.points)
            .classed('line-segment', true)
            .classed('approved', line.classes.approved)
            .classed('provisional', line.classes.provisional)
            .attr('r', CIRCLE_RADIUS_SINGLE_PT)
            .attr('cx', d => xScale(d.dateTime))
            .attr('cy', d => yScale(d.value));
    } else {
        const tsLine = d3Line()
            .x(d => xScale(d.dateTime))
            .y(d => yScale(d.value));
        elem.append('path')
            .datum(line.points)
            .classed('line-segment', true)
            .classed('approved', line.classes.approved)
            .classed('provisional', line.classes.provisional)
            .attr('d', tsLine);
    }
};

const drawDataLines = function(svg, {lineSegments, xScale, yScale}, container) {
    container = container || svg.append('g');

    container.selectAll('g').remove();
    const tsLineGroup = container
        .append('g')
            .attr('id', 'ts-group');

    for (const line of lineSegments) {
        drawDataLine(tsLineGroup, {line, xScale, yScale});
    }

    return container;
};

const drawAxisX = function (svg, {xScale, layout}) {
    svg.selectAll('.x-axis').remove();
    svg.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${layout.height})`)
        .call(axisBottom()
            .scale(xScale)
            .tickSizeOuter(0)
            .tickFormat(timeFormat('%b %d, %Y')));
};

const drawAxisY = function (svg, {yScale}) {
    svg.selectAll('.y-axis').remove();
    svg.append('g')
        .attr('transform', 'translate(0, 0)')
        .classed('y-axis', true)
        .call(axisLeft()
            .scale(yScale)
            .tickPadding(3)
            .tickSizeOuter(0));
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

const drawFocusLine = function (elem, {cursor, xScale, yScale}, focus) {
    console.log(new Date(cursor));
    // Create focus line, if it doesn't exist yet.
    focus = focus || elem
        .append('g')
            .attr('class', 'focus')
            .style('display', 'none')
            .call(elem => {
                elem.append('line')
                    .attr('class', 'focus-line');
            });

    // Update focus line with current cursor - default to end of graph
    cursor = cursor || xScale.domain()[1];
    if (cursor) {
        const x = xScale(cursor);
        const range = yScale.range();
        focus.select('.focus-line')
            .attr('y1', range[0])
            .attr('y2', range[1])
            .attr('x1', x)
            .attr('x2', x);
        focus.style('display', null);
    } else {
        focus.style('display', 'none');
    }

    return focus;
};

const drawOverlay = function (elem) {
    elem.append('rect')
        .attr('class', 'overlay')
        .attr('x', 0)
        .attr('y', 0)
        .call(link((rect, layout) => {
            rect.attr('width', layout.width)
                .attr('height', layout.height);
        }, getLayout))
        .on('mouseout', dispatch(() => setCursor(null)))
        .call(link((rect, xScale) => {
            rect.on('mouseover', dispatch(function () {
                const selectedTime = xScale.invert(mouse(rect.node())[0]);
                return setCursor(selectedTime);
            }));
            rect.on('mousemove', dispatch(function () {
                const selectedTime = xScale.invert(mouse(rect.node())[0]);
                return setCursor(selectedTime);
            }));
        }, getScaleX));
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
        .append('div')
            .classed('graph-container', true)
            .call(link(drawAxisYLabel, createStructuredSelector({
                unit: getCurrentWaterLevelUnit
            })))
            .append('svg')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .classed('chart', true)
                .call(initCropper)
                .call(link(drawDataLines, createStructuredSelector({
                    lineSegments: getLineSegments,
                    xScale: getScaleX,
                    yScale: getScaleY
                })))
                .call(link(drawAxisY, createStructuredSelector({
                    yScale: getScaleY
                })))
                .call(link(drawAxisX, createStructuredSelector({
                    xScale: getScaleX,
                    layout: getLayout
                })))
                .call(drawOverlay)
                .call(link(drawFocusLine, createStructuredSelector({
                    cursor: getCursor,
                    xScale: getScaleX,
                    yScale: getScaleY
                })));

    window.onresize = function () {
        store.dispatch(setLayout({width: node.offsetWidth, height: node.offsetHeight}));
    };
}
