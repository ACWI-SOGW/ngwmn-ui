import { scaleLinear } from 'd3-scale';
import { select, selectAll } from 'd3-selection';

import configureStore from 'ngwmn/store';
import { MOCK_WATER_LEVEL_RESPONSE } from 'ngwmn/services/cache.spec';

import attachToNode from './index';
import {
    drawAxisX, drawAxisY, drawAxisYLabel, drawDataLine, drawDataLines,
    drawFocusCircle, drawFocusLine, drawMessage, drawTooltip
} from './index';


describe('graph component', () => {
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

    describe('drawDataLine function', () => {
        it('should render single point as circle', () => {
            drawDataLine(svg, {
                line: {
                    points: [{
                        dateTime: new Date('2010-10-10'),
                        value: 10
                    }],
                    classes: {
                        approved: true,
                        provisional: false
                    }
                },
                xScale: () => 1,
                yScale: () => 1
            });

            const segments = selectAll('.line-segment');
            expect(segments.size()).toBe(1);
            const segment = select(segments.nodes()[0]);
            expect(segment.node().tagName.toLowerCase()).toBe('circle');
            expect(segment.classed('provisional')).toBe(false);
            expect(segment.classed('approved')).toBe(true);
        });

        it('should render two points as a line', () => {
            drawDataLine(svg, {
                line: {
                    points: [{
                        dateTime: new Date('2010-10-10'),
                        value: 10
                    }, {
                        dateTime: new Date('2010-10-11'),
                        value: 11
                    }],
                    classes: {
                        approved: true,
                        provisional: false
                    }
                },
                xScale: () => 1,
                yScale: () => 1
            });

            const segments = selectAll('.line-segment');
            expect(segments.size()).toBe(1);
            const segment = select(segments.nodes()[0]);
            expect(segment.node().tagName.toLowerCase()).toBe('path');
            expect(segment.classed('provisional')).toBe(false);
            expect(segment.classed('approved')).toBe(true);
        });
    });

    describe('drawDataLines function', () => {
        it('draws multiple line segments in a group', () => {
            drawDataLines(svg, {
                lineSegments: [{
                    points: [{
                        dateTime: new Date('2010-10-10'),
                        value: 10
                    }, {
                        dateTime: new Date('2010-10-11'),
                        value: 11
                    }],
                    classes: {
                        approved: true,
                        provisional: false
                    }
                }, {
                    points: [{
                        dateTime: new Date('2010-10-10'),
                        value: 10
                    }],
                    classes: {
                        approved: true,
                        provisional: false
                    }
                }],
                xScale: () => 1,
                yScale: () => 1
            });
            const group = select('g#ts-group');
            expect(group).not.toBe(null);
            expect(group.selectAll('.line-segment').size()).toBe(2);
        });
    });

    describe('drawAxisX function', () => {
        it('renders an axis', () => {
            drawAxisX(svg, {
                xScale: scaleLinear().domain([0, 1])
                                     .range([0, 100]),
                layout: {height: 100}
            });
            expect(svg.selectAll('.x-axis').size()).toBe(1);
        });
    });

    describe('drawAxisY function', () => {
        it('renders', () => {
            drawAxisY(svg, {
                yScale: scaleLinear().domain([0, 1])
                                     .range([0, 100])
            });
            expect(svg.selectAll('.y-axis').size()).toBe(1);
        });
    });

    describe('drawAxisYLabel function', () => {
        it('renders without a unit label and with', () => {
            let label = drawAxisYLabel(div, {});
            expect(label.text()).toEqual('Water levels');
            label = drawAxisYLabel(div, {unit: 'feet'}, label);
            expect(label.text()).toEqual('Water levels, feet');
        });
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

    describe('drawMessage function', () => {
        it('renders an alert message', () => {
            drawMessage(div, 'my message');
            expect(div.select('.message').text()).toEqual('my message');
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

    describe('entrypoint', () => {
        let store;

        beforeEach(() => {
            jasmine.Ajax.install();
            store = configureStore();
            attachToNode(store, div.node(), {
                agencycode: 'USGS',
                siteid: '430406089232901'
            });
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('renders initial chart with appropriate content', () => {
            expect(div.classed('loading')).toBe(true);
            expect(div.classed('has-error')).toBe(false);
            expect(div.selectAll('.chart').size()).toEqual(1);
            expect(div.selectAll('.tooltip-text').size()).toEqual(0);
            expect(div.selectAll('circle.focus').size()).toBe(0);
            expect(div.selectAll('.line-segment').size()).toBe(0);
        });

        it('renders chart after service data returned', (done) => {
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                responseText: MOCK_WATER_LEVEL_RESPONSE,
                contentType: 'text/xml'
            });
            window.setTimeout(() => {
                expect(div.classed('loading')).toBe(false);
                expect(div.classed('has-error')).toBe(false);
                expect(div.selectAll('.tooltip-text').size()).toEqual(1);
                expect(div.selectAll('circle.focus').size()).toBe(1);
                expect(div.selectAll('.line-segment').size()).toBe(1);
                done();
            });
        });

        it('sets error class on service error', (done) => {
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 500,
                reason: 'oops uh oh!',
                contentType: 'text/xml'
            });
            window.setTimeout(() => {
                expect(div.classed('loading')).toBe(false);
                expect(div.classed('has-error')).toBe(true);
                done();
            });
        });
    });
});
