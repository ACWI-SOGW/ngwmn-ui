import { select } from 'd3-selection';

import getMockStore from 'ngwmn/store.mock';
import drawConstruction from './construction';


describe('graph component construction', () => {
    const store = getMockStore();
    let svg;

    beforeEach(() => {
        svg = select('body')
            .append('svg')
                .attr('id', 'svg-container');
    });

    afterEach(() => {
        svg.remove();
    });

    xdescribe('drawConstruction function', () => {

        it('draws a screen representation', () => {
            drawConstruction(svg, {});
        });

        it('draws a casing representation', () => {
            drawConstruction(svg, {});
        });
    });
});
