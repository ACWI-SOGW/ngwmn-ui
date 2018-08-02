import { select } from 'd3-selection';
import { transition } from 'd3-transition';

export const FOCUS_CIRCLE_RADIUS = 5.5;


/**
 * Draws a tooltip focus line
 * @param  {Object} elem             D3 selector
 * @param  {Date} options.cursor     Date on the x-axis to draw the line
 * @param  {Function} options.xScale D3 scale function
 * @param  {Function} options.yScale D3 scale function
 * @param  {Object} focus            Previously-created container
 * @return {Object}                  Container of focus line
 */
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

/**
 * Draws a tooltip for a given cursor location
 * @param  {Object} elem                D3 selector
 * @param  {Object} options.cursorPoint Point: {value, unit}
 * @param  {String} options.unit        Unit of measure of the point
 * @param  {Object} tooltip             Previously-created tooltip container
 * @return {Object}                     Container created for the toolip
 */
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

/**
 * Draws a focus circle on a given point.
 * @param  {Object} elem                D3 selector
 * @param  {Object} options.cursorPoint Point of form: {value, dateTime}
 * @param  {Function} options.xScale    D3 scale function
 * @param  {Function} options.yScale    D3 scale function
 * @param  {Object} circleContainer     Previously-created container
 * @return {Object}                     Container created for focus circle
 */
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
