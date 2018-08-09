import { line as d3Line } from 'd3-shape';
import { transition } from 'd3-transition';

const CIRCLE_RADIUS_SINGLE_PT = 3;


/**
 * Draws a segment of a time series
 * @param  {Object} elem                D3 selector
 * @param  {Object} options.line        {classes, points}
 * @param  {Function} options.xScale    D3 scale function
 * @param  {Function} options.yScale    D3 scale function
 */
export const drawDataLine = function (elem, {line, xScale, yScale}, segment) {
    // If this is a single point line, then represent it as a circle.
    // Otherwise, render as a line.
    if (line.points.length === 1) {
        segment = segment || elem.append('circle')
            .classed('line-segment', true)
            .classed('approved', line.classes.approved)
            .classed('provisional', line.classes.provisional)
            .attr('r', CIRCLE_RADIUS_SINGLE_PT);
        segment
            .data(line.points)
            .transition(transition().duration(100))
            .attr('cx', d => xScale(d.dateTime))
            .attr('cy', d => yScale(d.value));
    } else {
        segment = segment || elem.append('path')
            .classed('line-segment', true)
            .classed('approved', line.classes.approved)
            .classed('provisional', line.classes.provisional)
            .attr('vector-effect', 'non-scaling-stroke');
        segment
            .datum(line.points)
            .transition(transition().duration(100))
            .attr('d', d3Line().x(d => xScale(d.dateTime))
                               .y(d => yScale(d.value)));
    }
    return segment;
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
export default function (svg, {lineSegments, xScale, yScale, clipPath}, context) {
    context = context || {
        segments: [],
        container: svg
            .append('g')
                .attr('id', 'ts-group')
                .attr('clip-path', `url(#${clipPath})`)
    };

    lineSegments.forEach((line, index) => {
        context.segments[index] = drawDataLine(
            context.container,
            {line, xScale, yScale},
            context.segments[index]
        );
    });

    return context;
}
