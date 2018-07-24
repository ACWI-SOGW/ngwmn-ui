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
    });
    observer.observe(svg.node(), {
        attributes: false,
        childList: true,
        subtree: true
    });
    return observer;
};
