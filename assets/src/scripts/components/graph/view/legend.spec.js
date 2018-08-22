import { select } from 'd3-selection';

import drawLegend from './legend';


describe('graph component legend', () => {
    let div;

    beforeEach(() => {
        div = select('body')
            .append('div')
                .attr('id', 'div-container');
    });

    afterEach(() => {
        div.remove();
    });

    it('renders approved when set', () => {
        drawLegend(div, {
            approved: true
        });
        expect(div.selectAll('line.approved').size()).toBe(1);
        expect(div.selectAll('span.approved').size()).toBe(1);
    });

    it('does not render approved when unset', () => {
        drawLegend(div, {
            approved: false
        });
        expect(div.selectAll('line.approved').size()).toBe(0);
        expect(div.selectAll('span.approved').size()).toBe(0);
    });

    it('renders provisional when set', () => {
        drawLegend(div, {
            provisional: true
        });
        expect(div.selectAll('line.provisional').size()).toBe(1);
        expect(div.selectAll('span.provisional').size()).toBe(1);
    });

    it('does not render provisional when unset', () => {
        drawLegend(div, {
            provisional: false
        });
        expect(div.selectAll('line.provisional').size()).toBe(0);
        expect(div.selectAll('span.provisional').size()).toBe(0);
    });
});
