import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

import { drawAxisX, drawAxisY, drawAxisYLabel } from './axes';


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
            expect(label.text()).toEqual('Depth to water');
            label = drawAxisYLabel(div, {unit: 'feet'}, label);
            expect(label.text()).toEqual('Depth to water, feet below land surface');
        });
    });
});
