import { line as d3Line } from 'd3-shape';

const CIRCLE_RADIUS_SINGLE_PT = 3;


/**
 * Draws a segment of a time series
 * @param  {Object} elem                D3 selector
 * @param  {Object} options.line        {classes, points}
 * @param  {Function} options.xScale    D3 scale function
 * @param  {Function} options.yScale    D3 scale function
 */
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

/**
 *
 * Draws a time series of water levels.
 * @param  {Object} svg                  D3 selector
 * @param  {Array} options.lineSegments  List of series segments to draw
 * @param  {Function} options.xScale     D3 scale function
 * @param  {Function} options.yScale     D3 scale function
 * @param  {Object} container            Element created by this function
 * @return {Object}                      Container of lines
 */
export default function (svg, {lineSegments, xScale, yScale}, container) {
    container = container || svg.append('g');

    container.selectAll('g').remove();
    const tsLineGroup = container
        .append('g')
            .attr('id', 'ts-group');

    for (const line of lineSegments) {
        drawDataLine(tsLineGroup, {line, xScale, yScale});
    }

    return container;
}
