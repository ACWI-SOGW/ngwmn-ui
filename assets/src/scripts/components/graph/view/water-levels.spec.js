import { select, selectAll } from 'd3-selection';

import { default as drawWaterLevels, drawDataLine } from './water-levels';


describe('graph component water levels', () => {
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

    it('draws multiple line segments in a group', () => {
        drawWaterLevels(svg, {
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
