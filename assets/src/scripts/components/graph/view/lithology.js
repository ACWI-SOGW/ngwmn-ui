import { transition } from 'd3-transition';

const LITHOLOGY_COLORS = [
    '#9A887E',
    '#72655C',
    '#CDE569',
    '#C6BBB7'
];


export default function (elem, {lithology}, container) {
    container = container || elem
        .append('g');

    const rects = container
        .selectAll('rect')
            .data(lithology);

    rects.exit()
        .transition(transition().duration(500))
            .style('opacity', '0')
            .remove();

    const newRects = rects.enter()
        .append('rect')
            .attr('x', datum => datum.x)
            .attr('y', datum => datum.y)
            .attr('width', datum => datum.width)
            .attr('height', datum => datum.height)
            .attr('fill', (_, index) => LITHOLOGY_COLORS[index % LITHOLOGY_COLORS.length]);

    rects.merge(newRects)
        .transition(transition().duration(20))
            .attr('x', datum => datum.x)
            .attr('y', datum => datum.y)
            .attr('width', datum => datum.width)
            .attr('height', datum => datum.height);

    return container;
}
