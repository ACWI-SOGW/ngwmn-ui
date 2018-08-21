import { callIf } from 'ngwmn/lib/utils';


export default function (elem, activeClasses) {
    return elem.append('div')
        .classed('legend', true)
        .call(callIf(activeClasses.approved, legend => {
            legend.append('span')
                .classed('approved', true)
                .text('Approved');
        }))
        .call(callIf(activeClasses.provisional, legend => {
            legend.append('span')
                .classed('provisional', true)
                .text('Provisional');
        }));
}
