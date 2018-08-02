import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat } from 'd3-time-format';



/**
 * Draws the x-axis
 * @param  {Object} svg              D3 selector
 * @param  {Function} options.xScale D3 scale function
 * @param  {Object} options.layout   {width, height}
 */
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

/**
 * Draws the y-axis
 * @param  {Object} svg              D3 selector
 * @param  {Function} options.yScale D3 scale function
 */
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

/**
 * Draws a y-axis label
 * @param  {Object} elem         D3 selector
 * @param  {String} options.unit Unit of measure of the y-axis
 * @param  {Object} label        Container previously-created by this function
 * @return {Object}              Container of label
 */
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
