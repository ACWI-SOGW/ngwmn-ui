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
            activeClasses: {
                approved: true
            }
        });
        expect(div.selectAll('svg.approved').size()).toBe(1);
    });

    it('does not render approved when unset', () => {
        drawLegend(div, {
            activeClasses: {
                approved: false
            }
        });
        expect(div.selectAll('svg.approved').size()).toBe(0);
    });

    it('renders provisional when set', () => {
        drawLegend(div, {
            activeClasses: {
                provisional: true
            }
        });
        expect(div.selectAll('svg.provisional').size()).toBe(1);
    });

    it('does not render provisional when unset', () => {
        drawLegend(div, {
            activeClasses: {
                provisional: false
            }
        });
        expect(div.selectAll('svg.provisional').size()).toBe(0);
    });
});
