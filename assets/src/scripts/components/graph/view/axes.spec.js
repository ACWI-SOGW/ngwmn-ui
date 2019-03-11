import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

import { drawAxisX, drawAxisY, drawAxisYConstructionDiagramElevation, drawAxisYLabel,
         drawAxisYLabelConstructionDiagramDepth, drawAxisYLabelConstructionDiagramElevation } from './axes';


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
                                     .range([0, 100]),
                layout: {x: 0, y: 0}
            });
            expect(svg.selectAll('.y-axis').size()).toBe(1);
        });
    });

    describe('drawAxisYConstructionDiagramElevation function', () => {
        it('renders', () => {
            drawAxisYConstructionDiagramElevation(svg, {
                yScale: scaleLinear().domain([0, 1])
                                     .range([0, 100]),
                layout: {x: 0, y: 0}
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

    describe('drawAxisYLabelConstructionDiagramDepth function', () => {
        it('renders without a unit label and with', () => {
            let label = drawAxisYLabelConstructionDiagramDepth(div, {});
            expect(label.text()).toEqual('Depth below land surface');
            label = drawAxisYLabelConstructionDiagramDepth(div, {unit: 'feet'}, label);
            expect(label.text()).toEqual('Depth below land surface in feet');
        });
    });

    describe('drawAxisYLabelConstructionDiagramElevation function', () => {
        it('renders without a unit label and with', () => {
            let label = drawAxisYLabelConstructionDiagramElevation(div, {});
            let wellLog =
                    {
                        'elevation': {
                            'scheme': 'NAVD88',
                            'unit': 'ft',
                            'value': 1000
                        }
                    };
            expect(label.text()).toEqual('Elevation');
            label = drawAxisYLabelConstructionDiagramElevation(div, {unit: 'feet', wellLog: wellLog}, label);
            expect(label.text()).toEqual('Elevation(NAVD88) in feet');
        });
    });

});
