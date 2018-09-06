import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat } from 'd3-time-format';

const UNIT_DISPLAY = {
    ft: 'feet',
    m: 'meters'
};


/**
 * Draws the x-axis
 * @param  {Object} elem             D3 selector
 * @param  {Function} options.xScale D3 scale function
 * @param  {Object} options.layout   {width, height}
 * @param  {Object} axis             D3 selector returned by previous invocation
 * @return {Object}                  Container for axis (g element)
 */
export const drawAxisX = function (elem, {xScale, layout}, axis) {
    axis = axis || elem
        .append('g')
        .classed('x-axis', true);
    axis.transition().duration(25)
        .attr('transform', `translate(${layout.x}, ${layout.y + layout.height})`)
        .call(axisBottom()
            .ticks(layout.width / 100)
            .scale(xScale)
            .tickSizeOuter(0)
            .tickFormat(timeFormat('%b %d, %Y')));
    return axis;
};

/**
 * Draws the y-axis
 * @param  {Object} svg                     D3 selector
 * @param  {Function} options.yScale        D3 scale function
 * @param  {Object} callback                Function will be called with bounding box after render
 * @param  {Object} context                 Context returned by previous invocation
 * @return {Object}                         Context for next invocation
 */
export const drawAxisY = function (elem, {yScale, layout}, callback, context) {
    context = context || {};
    context.axis = context.axis || elem
        .append('g')
        .classed('y-axis', true);
    context.bBox = context.bBox || {};

    context.axis.transition().duration(25)
        .attr('transform', `translate(${layout.x}, ${layout.y})`)
        .call(axisLeft()
            .scale(yScale)
            .tickPadding(3)
            .tickSizeOuter(0))
        .on('end', function () {
            try {
                const newBBox = context.axis.node().getBBox();
                if (newBBox.x !== context.bBox.x ||
                        newBBox.y !== context.bBox.y ||
                        newBBox.width !== context.bBox.width ||
                        newBBox.height !== context.bBox.height) {
                    context.bBox = newBBox;
                    callback(newBBox);
                }
            } catch (error) {
                // See here for details on why we ignore getBBox() exceptions
                // to fix issues with Firefox:
                // https://bugzilla.mozilla.org/show_bug.cgi?id=612118
                // https://stackoverflow.com/questions/28282295/getbbox-of-svg-when-hidden.
            }
        });

    return context;
};

/**
 * Draws a y-axis label
 * @param  {Object} elem         D3 selector
 * @param  {String} options.unit Unit of measure of the y-axis
 * @param  {Object} label        Container previously-created by this function
 * @return {Object}              Container of label (span)
 */
export const drawAxisYLabel = function (elem, {unit}, label) {
    // Create a span for the label, if it doesn't already exist
    label = label || elem.append('span')
        .classed('y-label', true);

    // Set the label text
    if (unit) {
        const unitDisplay = UNIT_DISPLAY[unit.toLowerCase()] || unit;
        label.text(`Depth to water, ${unitDisplay} below land surface`);
    } else {
        label.text('Depth to water');
    }

    return label;
};
