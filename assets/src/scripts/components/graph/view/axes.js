import { axisBottom, axisLeft, axisRight } from 'd3-axis';
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
 * A function that will draw the y-axis for elevation on the construction diagram
 * @param {Object}elem                  A D3 selector that forms the HTML structure of the page
 * @param {function} yScaleElevation    A D3 scale function, containing the highest and lowest points (the domain) of the axis
 * @param {Object}layout                The position and size of the lithology chart
 * @param {Object} context              The existing context containing the bounding box and axis information
 * @returns {Object} context            The new context
 */
export const drawAxisYElevation = function (elem, {yScale: yScaleElevation, layout}, context) {
    context = context || {};
    context.axis = context.axis || elem
        .append('g')
            .classed('y-axis', true);
    context.bBox = context.bBox || {};
    context.axis
        //change the horizontal (x position) of the y-axis for elevation to match the width of the lithology chart
        .attr('transform', `translate(${layout.x  + layout.width}, ${layout.y} )`)
        .call(axisRight()
            .scale(yScaleElevation)
            .tickPadding(3)
            .tickSizeOuter(0));

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
        unit = unit.toLowerCase();
        const unitDisplay = UNIT_DISPLAY[unit] || unit;
        label.text(`Depth to water, ${unitDisplay} below land surface`);
    } else {
        label.text('Depth to water');
    }

    return label;
};

/**
 * Function that creates and adds the label for the y-axis depth on the construction diagram
 * @param {object} elem     A D3 selector that forms the HTML structure of the page
 * @param {object} unit     The unit of measurement
 * @param {object} label    The current label for the y-axis depth on the construction diagram
 * @returns {object} label  The new label for the y-axis depth on the construction diagram
 */
export const drawAxisYLabelConstructionDiagramDepth = function (elem, {unit}, label) {
    // Create a span for the label, if it doesn't already exist
    label = label || elem.append('span')
        .classed('y-label', true);
    // Set the label text
    if (unit) {
        unit = unit.toLowerCase();
        const unitDisplay = UNIT_DISPLAY[unit] || unit;
        label.text(`Depth below land surface in ${unitDisplay}`);
    } else {
        label.text('Depth below land surface');
    }

    return label;
};

/**
 * Function that creates and adds the label for the y-axis depth on the construction diagram
 * @param {object} elem     A D3 selector that forms the HTML structure of the page
 * @param {object} unit     The unit of measurement
 * @param {object} wellLog  The well log containing the elevation scheme
 * @param {object} label    The current label for the y-axis depth on the construction diagram
 * @returns {object} label  The new label for the y-axis depth on the construction diagram
 */
export const drawAxisYLabelLithologyElevation = function (elem, {unit, wellLog}, label) {
    // Create a span for the label, if it doesn't already exist
    label = label || elem.append('span')
        .classed('y-label', true);
    if (unit && wellLog) {
        unit = unit.toLowerCase();
        const elevationScheme = wellLog['elevation']['scheme'];
        const unitDisplay = UNIT_DISPLAY[unit] || unit;
        label.text(`Elevation(${elevationScheme}) in ${unitDisplay}`);
    } else {
        label.text('Elevation');
    }

    return label;
};
