import { link } from 'ngwmn/lib/d3-redux';

import {
    getActiveClasses, getLithologyVisibility, setLithologyVisibility
} from '../state';


const KEY_SIZE = {
    width: 20,
    height: 10
};

const appendKey = function (elem, className) {
    elem.append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', KEY_SIZE.width)
        .attr('height', KEY_SIZE.height)
        .attr('viewBox', `0 0 ${KEY_SIZE.width} ${KEY_SIZE.height}`)
        .append('line')
            .classed('line-segment', true)
            .classed(className, true)
            .attr('y1', KEY_SIZE.height / 2)
            .attr('y2', KEY_SIZE.height / 2)
            .attr('x1', 0)
            .attr('x2', KEY_SIZE.width);
};

export const drawActiveClasses = (classes, activeClasses) => {
    // Remove any previously drawn legend items
    classes.selectAll('*').remove();

    if (activeClasses.approved) {
        classes
            .call(appendKey, 'approved')
            .append('span')
                .classed('approved', true)
                .text('Approved');
    }
    if (activeClasses.provisional) {
        classes
            .call(appendKey, 'provisional')
            .append('span')
                .classed('provisional', true)
                .text('Provisional');
    }
};

export default function (elem, store, opts) {
    return elem.append('div')
        .classed('legend', true)
        .call(legend => {
            legend.append('span')
                .classed('active-classes', true)
                .call(link(store, drawActiveClasses, getActiveClasses(opts)));
        })
        .append('span')
            .classed('show-lithology', true)
            .call(span => {
                span.append('input')
                    .attr('id', `show-lithology-${opts.id}`)
                    .attr('type', 'checkbox')
                    .classed('usa-checkbox__input', true)
                    .call(link(store, (input, visibility) => {
                        input.property('checked', visibility);
                    }, getLithologyVisibility(opts.id)))
                    .on('change', function () {
                        store.dispatch(setLithologyVisibility(opts.id, this.checked));
                    });
                span.append('label')
                    .classed('usa-checkbox__label', true)
                    .attr('for', `show-lithology-${opts.id}`)
                    .text('Show lithology');
            });
}
