import { callIf } from 'ngwmn/lib/utils';

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

export default function (elem, activeClasses) {
    elem.select('.legend')
        .remove();

    return elem.append('div')
        .classed('legend', true)
        .call(callIf(activeClasses.approved, legend => {
            legend
                .call(appendKey, 'approved')
                .append('span')
                    .classed('approved', true)
                    .text('Approved');
        }))
        .call(callIf(activeClasses.provisional, legend => {
            legend
                .call(appendKey, 'provisional')
                .append('span')
                    .classed('provisional', true)
                    .text('Provisional');
        }));
}
