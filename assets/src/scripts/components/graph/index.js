import { axisBottom, axisLeft } from 'd3-axis';
import { mouse, select } from 'd3-selection';
import { line as d3Line } from 'd3-shape';
import { timeFormat } from 'd3-time-format';
import { transition } from 'd3-transition';
import { createStructuredSelector } from 'reselect';

import { link } from 'ngwmn/lib/d3-redux';
import { initCropper } from 'ngwmn/lib/utils';
import { retrieveWaterLevels } from 'ngwmn/services/state/index';

import {
    getCurrentWaterLevels, getCurrentWaterLevelUnit, getCursor, getCursorPoint,
    getLayout, getLineSegments, getScaleX, getScaleY, setCursor, setLayout,
    setOptions
} from './state';


const CIRCLE_RADIUS_SINGLE_PT = 3;
const FOCUS_CIRCLE_RADIUS = 5.5;


export const drawDataLine = function (elem, {line, xScale, yScale}) {
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

export const drawDataLines = function (svg, {lineSegments, xScale, yScale}, container) {
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

export const drawAxisX = function (svg, {xScale, layout}) {
    svg.selectAll('.x-axis').remove();
    svg.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${layout.height})`)
        .call(axisBottom()
            .scale(xScale)
            .tickSizeOuter(0)
            .tickFormat(timeFormat('%b %d, %Y')));
};

export const drawAxisY = function (svg, {yScale}) {
    svg.selectAll('.y-axis').remove();
    svg.append('g')
        .attr('transform', 'translate(0, 0)')
        .classed('y-axis', true)
        .call(axisLeft()
            .scale(yScale)
            .tickPadding(3)
            .tickSizeOuter(0));
};

export const drawAxisYLabel = function (elem, {unit}, label) {
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

export const drawFocusLine = function (elem, {cursor, xScale, yScale}, focus) {
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

export const drawTooltip = function (elem, {cursorPoint, unit}, tooltip) {
    tooltip = tooltip || elem.append('div')
        .attr('class', 'tooltip');

    const texts = tooltip
        .selectAll('div')
        .data(cursorPoint ? [cursorPoint] : []);

    // Remove old text labels after fading them out
    texts.exit()
        .transition(transition().duration(500))
            .style('opacity', '0')
            .remove();

    // Add new text labels
    const newTexts = texts.enter()
        .append('div');

    // Update the text and backgrounds of all tooltip labels
    const merge = texts.merge(newTexts)
        .interrupt()
        .style('opacity', '1');

    merge
        .text(datum => {
            const parts = [];
            if (datum.value) {
                parts.push(`${datum.value} ${unit}`);
            }
            if (datum.dateTime) {
                parts.push(datum.dateTime.toLocaleString());
            }
            return parts.join(' - ');
        })
        .each(function (datum) {
            select(this)
                .classed('tooltip-text', true)
                .classed('approved', datum.approved)
                .classed('provisional', !datum.approved);
        });

    return tooltip;
};

export const drawFocusCircle = function (elem, {cursorPoint, xScale, yScale}, circleContainer) {
    // Put the circles in a container so we can keep the their position in the
    // DOM before rect.overlay, to prevent the circles from receiving mouse
    // events.
    circleContainer = circleContainer || elem.append('g');

    const circles = circleContainer
        .selectAll('circle.focus')
            .data(cursorPoint ? [cursorPoint] : []);

    // Remove old circles after fading them out
    circles.exit()
        .transition(transition().duration(500))
            .style('opacity', '0')
            .remove();

    // Add new focus circles
    const newCircles = circles.enter()
        .append('circle')
            .attr('class', 'focus')
            .attr('r', FOCUS_CIRCLE_RADIUS)
            .attr('cx', datum => xScale(datum.dateTime))
            .attr('cy', datum => yScale(datum.value));

    // Update the location of pre-existing circles
    circles.merge(newCircles)
        .transition(transition().duration(20))
            .style('opacity', '.6')
            .attr('cx', datum => xScale(datum.dateTime))
            .attr('cy', datum => yScale(datum.value));

    return circleContainer;
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
        .call(link(store, (elem, waterLevels) => {
            elem.classed('loading', !waterLevels || !waterLevels.samples)
                .classed('has-error', waterLevels && waterLevels.error);
        }, getCurrentWaterLevels))
        .append('div')
            .classed('graph-container', true)
            .call(link(store, drawAxisYLabel, createStructuredSelector({
                unit: getCurrentWaterLevelUnit
            })))
            .call(link(store, drawTooltip, createStructuredSelector({
                cursorPoint: getCursorPoint,
                unit: getCurrentWaterLevelUnit

            })))
            .append('svg')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .classed('chart', true)
                .call(initCropper)
                .call(link(store, drawDataLines, createStructuredSelector({
                    lineSegments: getLineSegments,
                    xScale: getScaleX,
                    yScale: getScaleY
                })))
                .call(link(store, drawAxisY, createStructuredSelector({
                    yScale: getScaleY
                })))
                .call(link(store, drawAxisX, createStructuredSelector({
                    xScale: getScaleX,
                    layout: getLayout
                })))
                .call(link(store, drawFocusLine, createStructuredSelector({
                    cursor: getCursor,
                    xScale: getScaleX,
                    yScale: getScaleY
                })))
                .call(link(store, drawFocusCircle, createStructuredSelector({
                    cursorPoint: getCursorPoint,
                    xScale: getScaleX,
                    yScale: getScaleY
                })))
                .append('rect')
                    .attr('class', 'overlay')
                    .attr('x', 0)
                    .attr('y', 0)
                    .call(link(store, (rect, layout) => {
                        // Set the overlay size, including a little extra space to deal
                        // with the focus circle when it's drawn on the right-most extent.
                        rect.attr('width', layout.width + FOCUS_CIRCLE_RADIUS)
                            .attr('height', layout.height);
                    }, getLayout))
                    .on('mouseout', () => {
                        store.dispatch(setCursor(null));
                    })
                    .call(link(store, (rect, xScale) => {
                        rect.on('mouseover', () => {
                            const selectedTime = xScale.invert(mouse(rect.node())[0]);
                            store.dispatch(setCursor(selectedTime));
                        });
                        rect.on('mousemove', () => {
                            const selectedTime = xScale.invert(mouse(rect.node())[0]);
                            store.dispatch(setCursor(selectedTime));
                        });
                    }, getScaleX));

    window.onresize = function () {
        store.dispatch(setLayout({width: node.offsetWidth, height: node.offsetHeight}));
    };
}
