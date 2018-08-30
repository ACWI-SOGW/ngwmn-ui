import { area as d3Area, line as d3Line } from 'd3-shape';
import { transition } from 'd3-transition';

const CIRCLE_RADIUS_SINGLE_PT = 2;


/**
 * Draws a segment of a time series
 * @param  {Object} elem                D3 selector
 * @param  {Object} options.line        {class, points}
 * @param  {Function} options.xScale    D3 scale function
 * @param  {Function} options.yScale    D3 scale function
 * @param  {Object} segment             D3 selector returned by previous invocation
 * @return {Object}                     Element for this line segment
 */
export const drawDataLine = function (elem, {line, xScale, yScale}, segment) {
    // If this is a single point line, then represent it as a circle.
    // Otherwise, render as a line.
    if (line.points.length === 1) {
        segment = segment || elem.append('circle')
            .classed('line-segment', true)
            .classed(line.class, true)
            .attr('r', CIRCLE_RADIUS_SINGLE_PT);
        segment
            .data(line.points)
            .transition(transition().duration(25))
            .attr('cx', d => xScale(d.dateTime))
            .attr('cy', d => yScale(d.value));
    } else {
        segment = segment || elem.append('path')
            .classed('line-segment', true)
            .classed(line.class, true)
            .attr('vector-effect', 'non-scaling-stroke');
        segment
            .datum(line.points)
            .transition(transition().duration(25))
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
 * @param  {Object} context              Context of form {segments, container}
 * @return {Object}                      {segments, container} context for next invocation
 */
export default function (svg, {lineSegments, chartPoints, xScale, yScale}, clipPathID, context) {
    context = context || {
        segments: [],
        area: svg
            .append('path')
                .classed('area-path', true),
        container: svg
            .append('g')
                .attr('id', 'ts-group')
                .attr('clip-path', `url(#${clipPathID})`)
    };

    lineSegments.forEach((line, index) => {
        context.segments[index] = drawDataLine(
            context.container,
            {line, xScale, yScale},
            context.segments[index]
        );
    });

    context.area
        .datum(chartPoints)
        .transition(transition().duration(25))
        .attr('d', d3Area().x(d => xScale(d.dateTime))
                           .y1(d => yScale(d.value))
                           .y0(yScale.range()[0]));

    return context;
}
