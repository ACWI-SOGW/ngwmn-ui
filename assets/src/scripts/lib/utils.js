/**
 * Returns a function that will be a no-op if a condition is false.
 * Use to insert conditionals into declarative-style D3-chained method calls.
 * @param  {Boolean} condition If true, will run `func`
 * @param  {Function} func
 */
export const callIf = function (condition, func) {
    return function (...args) {
        if (condition) {
            func(...args);
        }
    };
};

/**
 * Crops the viewBox of a given D3 selector containing an SVG node.
 * @param  {Object} svg SVG selector
 * @return {Object} SVG selector after cropping
 */
export const crop = function (svg) {
    // Set the viewBox to the bounding box of the SVG.
    const bBox = svg.node().getBBox();
    svg.attr('viewBox', `${bBox.x} ${bBox.y} ${bBox.width} ${bBox.height}`);
    console.log(svg.attr('viewBox'));
    return svg;
};

/**
 * Creates a self-cropping SVG node that delegates drawing to another function.
 * @param  {Object}    elem      D3 selector to append SVG node to
 * @param  {Function}  func      This function is called with the created SVG node.
 * @return {Object}              D3 selector containing
 */
export const croppedSvg = function (func) {
    let context;
    return function (elem, options, svg) {
        svg = svg || elem.append('svg')
            .attr('xmlns', 'http://www.w3.org/2000/svg');

        // Delegate drawing to func
        context = func(elem, options, context);

        // Set the viewBox to the bounding box of the SVG.
        const bBox = svg.node().getBBox();
        svg.attr('viewBox', `${bBox.x} ${bBox.y} ${bBox.width} ${bBox.height}`);

        return svg;
    };
};

/**
 * Register a MutationObserver that will crop an SVG node when its contents
 * change.
 * @param  {Object} svg D3 selection containing an SVG node
 */
export const initCropper = function (svg) {
    // Create an observer instance linked to the callback function
    var observer = new window.MutationObserver(function () {
        // Set the viewBox to the bounding box of the SVG.
        const bBox = svg.node().getBBox();
        svg.attr('viewBox', `${bBox.x} ${bBox.y} ${bBox.width} ${bBox.height}`);
        console.log('Cropping SVG viewbox...');
    });
    observer.observe(svg.node(), {
        attributes: false,
        childList: true,
        subtree: true
    });
};
