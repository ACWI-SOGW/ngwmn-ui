import { select } from 'd3-selection';

import { default as drawLithology, rgbFromHex } from './lithology';


const MOCK_LITHOLOGY = [{
    x: 10,
    y: 1,
    width: 100,
    height: 1,
    colors: ['brown'],
    materials: [601, 602],
    title: '1 - 2 ft, Siltstone'
}, {
    x: 10,
    y: 2,
    width: 100,
    height: 1,
    colors: ['yellow'],
    materials: [700],
    title: '2 - 3 ft, Siltstone'
}];

describe('lithology', () => {
    let svg;

    beforeEach(() => {
        svg = select('body')
            .append('svg')
                .attr('id', 'svg-container');
    });

    afterEach(() => {
        svg.remove();
    });

    describe('draws', () => {
        it('a rect per layer when visible', () => {
            drawLithology(svg, {
                lithology: MOCK_LITHOLOGY,
                visible: true
            });
            expect(svg.selectAll('rect').size()).toBe(MOCK_LITHOLOGY.length);
        });

        it('not rects when not visible', () => {
            drawLithology(svg, {
                lithology: MOCK_LITHOLOGY,
                visible: false
            });
            expect(svg.selectAll('rect').size()).toBe(0);
        });
    });

    describe('rgbFromHex', () => {
        it('returns correct values', () => {
            expect(rgbFromHex('#ffffff')).toEqual([1, 1, 1]);
            expect(rgbFromHex('#000000')).toEqual([0, 0, 0]);
            expect(rgbFromHex('#ff0000')).toEqual([1, 0, 0]);
            const num = parseInt('80', 16) / 255;
            expect(rgbFromHex('#808080')).toEqual([num, num, num]);
        });
    });
});
