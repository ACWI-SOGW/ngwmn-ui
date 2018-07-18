import { select } from 'd3-selection';

//import { dispatch, link, provide } from 'ngwmn/lib/d3-redux';
//import { getWaterLevels } from 'ngwmn/services/cache';


const drawGraph = function (elem) {
    elem.append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .append('text')
            .attr('x', 50)
            .attr('y', 50)
            .text('Graph goes here');
};


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


export default function (store, node, {siteno} = {}) {
    if (!siteno) {
        select(node).call(drawMessage, 'No data is available.');
        return;
    }

    // TODO: clear loading after service call returns instead of here
    window.setTimeout(() => {
        select(node)
            .classed('loading', false)
            .call(drawGraph);
    }, 2000);
}
