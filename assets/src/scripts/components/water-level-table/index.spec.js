import { select } from 'd3-selection';

import mockStore from 'ngwmn/store.mock';

import attachToNode from './index';
import { isTableRendered, renderTable } from './state';

fdescribe('water level table component', () => {

    let div;

    beforeEach(() => {
        div = select('body')
            .append('div')
                .attr('id', 'test-div');
        div.append('button');
        div.append('div')
            .attr('id', 'water-levels-div');
    });

    afterEach(() => {
        div.remove();
    });

    describe('default entry point', () => {
        let store = mockStore();

        beforeEach(() => {
            store = mockStore();
        });

        it('water level table is not rendered when store state is not rendered', () => {
            attachToNode(store, div.node(), {
                agencycd: 'USGS',
                siteid: '423532088254601'
            });

            expect(div.selectAll('table').size()).toBe(0);
        });

        it('If the button is clicked store is updated', () => {
            spyOn(store, 'dispatch').and.callThrough();
            attachToNode(store, div.node(), {
                agencycd: 'USGS',
                siteid: '423532088254601'
            });
            div.select('button').dispatch('click');

            expect(store.dispatch).toHaveBeenCalled();
            expect(isTableRendered(store.getState())).toBe(true);
        });

        it('The table should be rendered if the table rendered is true in the store', () => {
            store.dispatch(renderTable());
            attachToNode(store, div.node(), {
                agencycd: 'USGS',
                siteid: '423532088254601'
            });

            expect(div.selectAll('table').size()).toBe(1);
            expect(div.selectAll('tbody tr').size()).toBe(529);
        });

    });
});