import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

import { drawFocusCircle, drawFocusLine, drawTooltip } from './cursor';


describe('graph component cursor', () => {
    let svg;
    let div;

    beforeEach(() => {
        svg = select('body')
            .append('svg')
                .attr('id', 'svg-container');
        div = select('body')
            .append('div')
                .attr('id', 'div-container');
    });

    afterEach(() => {
        svg.remove();
        div.remove();
    });

    describe('drawFocusLine function', () => {
        let focus;
        const xScale = scaleLinear().domain([0, 1])
                                    .range([0, 100]);
        const yScale = scaleLinear().domain([0, 1])
                                    .range([0, 100]);

        beforeEach(() => {
            focus = drawFocusLine(svg, {cursor: null, xScale, yScale});
        });

        afterEach(() => {
            focus.remove();
        });

        it('renders hidden line when no cursor', () => {
            expect(focus).not.toBe(null);
            expect(focus.node().tagName.toLowerCase()).toEqual('g');
            expect(focus.selectAll('.focus-line').size()).toBe(1);
            expect(focus.style('display')).toEqual('none');
        });

        it('updates line to visible when cursor set', () => {
            focus = drawFocusLine(svg, {cursor: new Date(), xScale, yScale});
            expect(focus.style('display')).not.toEqual('none');
        });
    });

    describe('drawTooltip function', () => {
        let tooltip;

        beforeEach(() => {
            tooltip = drawTooltip(div, {
                cursorPoint: null,
                unit: 'feet'
            });
        });

        afterEach(() => {
            tooltip.remove();
        });

        it('does not render null points', () => {
            expect(tooltip.selectAll('.tooltip-text').size()).toEqual(0);
        });

        it('renders non-null points', () => {
            tooltip = drawTooltip(div, {
                cursorPoint: {
                    value: 10,
                    dateTime: new Date('2010-10-10T10:00:00.000'),
                    datum: true
                },
                unit: 'feet'
            }, tooltip);
            expect(tooltip.selectAll('.tooltip-text').size()).toEqual(1);
            let expectedText = '10 feet - 10/10/2010, 10:00:00 AM';
            expect(tooltip.select('.tooltip-text').text()).toEqual(expectedText);

            tooltip = drawTooltip(div, {
                cursorPoint: {
                    value: 100,
                    dateTime: new Date('2010-10-10T11:00:00.000'),
                    datum: true
                },
                unit: 'meters'
            }, tooltip);
            expect(tooltip.selectAll('.tooltip-text').size()).toEqual(1);
            expectedText = '100 meters - 10/10/2010, 11:00:00 AM';
            expect(tooltip.select('.tooltip-text').text()).toEqual(expectedText);
        });
    });

    describe('drawFocusCircle function', () => {
        const xScale = scaleLinear().domain([0, 1])
                                    .range([0, 100]);
        const yScale = scaleLinear().domain([0, 1])
                                    .range([0, 100]);

        let circleContainer;

        beforeEach(() => {
            circleContainer = drawFocusCircle(svg, {
                cursorPoint: null,
                xScale,
                yScale
            });
        });

        afterEach(() => {
            circleContainer.remove();
        });

        it('renders initial null cursor', () => {
            expect(circleContainer.node().tagName.toLowerCase()).toEqual('g');
            expect(circleContainer.selectAll('.focus').size()).toBe(0);
        });

        it('renders non-null cursor', () => {
            circleContainer = drawFocusCircle(svg, {
                cursorPoint: {
                    value: 10,
                    dateTime: new Date('2010-10-10 10:00:00 PM'),
                    datum: true
                },
                xScale,
                yScale
            });
            expect(circleContainer.selectAll('.focus').size()).toBe(1);
        });
    });
});
