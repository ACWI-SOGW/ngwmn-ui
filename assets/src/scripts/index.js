/**
 * Entry-point for site location page.
 */

import 'uswds';

import GraphComponent from 'ngwmn/components/graph/index';
import configureStore from 'ngwmn/store';


const COMPONENTS = {
    graph: GraphComponent
};


const main = function () {
    // NOTE: Here we use a try/catch block rather than a global "onerror"
    // handler, to avoid the exception data from getting stripped out by
    // anything in the build tooling.
    // This method retains access to the exception object.
    try {
        let nodes = document.getElementsByClassName('ngwmn-component');
        let store = configureStore();
        for (let node of nodes) {
            // If options is specified on the node, expect it to be a JSON string.
            // Otherwise, use the dataset attributes as the component options.
            const options = node.dataset.options ? JSON.parse(node.dataset.options) : node.dataset;
            COMPONENTS[node.dataset.component](store, node, options);
        }

    } catch (err) {
        // Send exception to Google Analytics.
        if (window.ga) {
            window.ga('send', 'exception', {
                // exDescription will be truncated at 150 bytes
                exDescription: err.stack,
                exFatal: true
            });
        }
        throw err;
    }
};


if (document.readyState !== 'loading') {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main, false);
}
