import { select } from 'd3-selection';
import { createStructuredSelector } from 'reselect';

import getMockStore from 'ngwmn/store.mock';
import { getScaleX, getScaleY } from '../state';
import drawDomainMapping from './domain-mapping';


describe('graph component domain mapping', () => {
    let svg;
    let store;

    beforeEach(() => {
        svg = select('body')
            .append('svg')
                .attr('id', 'svg-container');
        store = getMockStore();
    });

    afterEach(() => {
        svg.remove();
    });

    const selector = createStructuredSelector({
        xScaleFrom: getScaleX('main'),
        yScaleFrom: getScaleY('main'),
        xScaleTo: getScaleX('lithology'),
        yScaleTo: getScaleY('lithology')
    });

    it('renders two paths', () => {
        drawDomainMapping(svg, selector(store.getState()));
        expect(svg.selectAll('path').size()).toEqual(2);
    });
});
