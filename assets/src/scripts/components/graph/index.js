import { select } from 'd3-selection';


const drawMessage = function(elem, message) {
    // Set up parent element and SVG
    elem.innerHTML = '';
    const alertBox = elem
        .append('div')
            .attr('class', 'usa-alert usa-alert-warning')
            .append('div')
                .attr('class', 'usa-alert-body');
    alertBox
        .append('h3')
            .attr('class', 'usa-alert-heading')
            .html('Alert');
    alertBox
        .append('p')
            .html(message);
};


export default function (store, node, {siteID} = {}) {
    if (!siteID) {
        select(node).call(drawMessage, 'No data is available.');
        return;
    }
}
