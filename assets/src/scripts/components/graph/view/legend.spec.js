import { select } from 'd3-selection';

import getMockStore from 'ngwmn/store.mock';

import drawLegend from './legend';
import { drawActiveClasses } from './legend';


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
        drawActiveClasses(div, {
            approved: true
        });
        expect(div.selectAll('line.approved').size()).toBe(1);
        expect(div.selectAll('span.approved').size()).toBe(1);
    });

    it('does not render approved when unset', () => {
        drawActiveClasses(div, {
            approved: false
        });
        expect(div.selectAll('line.approved').size()).toBe(0);
        expect(div.selectAll('span.approved').size()).toBe(0);
    });

    it('renders provisional when set', () => {
        drawActiveClasses(div, {
            provisional: true
        });
        expect(div.selectAll('line.provisional').size()).toBe(1);
        expect(div.selectAll('span.provisional').size()).toBe(1);
    });

    it('does not render provisional when unset', () => {
        drawActiveClasses(div, {
            provisional: false
        });
        expect(div.selectAll('line.provisional').size()).toBe(0);
        expect(div.selectAll('span.provisional').size()).toBe(0);
    });

    it('draws a checkbox for lithology toggling', () => {
        const store = getMockStore();
        drawLegend(div, store, {id: 1});
        expect(div.selectAll('input').size()).toBe(1);
    });

    describe('lithology checkbox', () => {
        let store;

        beforeEach(() => {
            store = getMockStore();
            drawLegend(div, store, {id: 1});
        });

        it('draws a checkbox for lithology toggling', () => {
            expect(div.selectAll('input').size()).toBe(1);
        });

        it('triggers an action on click', () => {
            spyOn(store, 'dispatch').and.callThrough();
            div.select('input').dispatch('change');
            expect(store.dispatch).toHaveBeenCalledWith({
                type: 'components/graph/options/LITHOLOGY_VISIBILITY_SET',
                payload: {
                    id: 1,
                    lithologyVisibility: true
                }
            });
        });
    });
});
