import { bisector } from 'd3-array';
import ResizeObserver from 'resize-observer-polyfill';

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
    // Try a few methods to delay registering this until after the browser has
    // rendered the SVG node.
    // Attempt to address this bug:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=612118
    const register = window.requestIdleCallback ||
                     window.requestAnimationFrame ||
                     window.setTimeout;
    register(() => {
        // Create an observer instance linked to the callback function
        const observer = new ResizeObserver(entries => {
            // Set the viewBox to the bounding box of the SVG.
            const bBox = entries[0].target.getBBox();
            svg.attr('viewBox', `${bBox.x} ${bBox.y} ${bBox.width} ${bBox.height}`);
        });
        observer.observe(svg.node());
    });
};

/*
 * Return the data point nearest to time and its index.
 * @param {Array} data  array of Object where one of the keys is time.
 * @param {Date} time   target time
 * @param {Date} attr   attribute of data objects containing date object
 * @return {Object}     {datum, index}
 */
export const getNearestTime = function (data, time, attr='dateTime') {
    // Function that returns the left bounding point for a given chart point.
    if (data.length === 0) {
        return null;
    }
    const bisectDate = bisector(d => d[attr]).left;
    let index = bisectDate(data, time, 1);
    let datum;
    let d0 = data[index - 1];
    let d1 = data[index];

    if (d0 && d1) {
        datum = time - d0[attr] > d1[attr] - time ? d1 : d0;
    } else {
        datum = d0 || d1;
    }

    // Return the nearest data point and its index.
    return {
        datum,
        index: datum === d0 ? index - 1 : index
    };
};
