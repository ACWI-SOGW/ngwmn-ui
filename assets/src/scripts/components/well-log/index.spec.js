import { select } from 'd3-selection';


describe('well-log', () => {
    let div;

    beforeEach(() => {
        div = select('body')
            .append('div')
                .attr('id', 'div-container');
    });

    afterEach(() => {
        div.remove();
    });

    describe('todo', () => {
        expect(div).not.toBe(null);
    });
});
