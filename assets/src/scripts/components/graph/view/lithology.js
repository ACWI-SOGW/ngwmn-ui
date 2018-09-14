import { transition } from 'd3-transition';

import config from 'ngwmn/config';


const LITHOLOGY_COLORS = [
    '#9A887E',
    '#72655C',
    '#F0E68C',
    '#C6BBB7'
];

export default function (elem, {lithology}, container) {
    container = container || elem
        .append('g')
            .classed('lithology', true)
            .call(g => {
                g.append('defs')
                    .append('pattern')
                        .attr('id', 'lithology-601')
                        .attr('patternUnits', 'userSpaceOnUse')
                        .attr('width', 53.2)
                        .attr('height', 53.4)
                        .append('image')
                            .attr('xlink:href', `${config.STATIC_ROOT}/img/lithology-patterns/605.svg`)
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('width', 53.2)
                            .attr('height', 53.4);
                g.append('defs')
                    .append('pattern')
                        .attr('id', 'lithology-603')
                        .attr('patternUnits', 'userSpaceOnUse')
                        .attr('width', 85)
                        .attr('height', 85.1)
                        .append('image')
                            .attr('xlink:href', `${config.STATIC_ROOT}/img/lithology-patterns/609.svg`)
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('width', 85)
                            .attr('height', 85.1);
                g.append('defs')
                    .append('pattern')
                        .attr('id', 'lithology-602')
                        .attr('patternUnits', 'userSpaceOnUse')
                        .attr('width', 54.1)
                        .attr('height', 58)
                        .append('image')
                            .attr('xlink:href', `${config.STATIC_ROOT}/img/lithology-patterns/625.svg`)
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('width', 54.1)
                            .attr('height', 58);
            });

    const rects = container
        .selectAll('rect')
            .data(lithology);

    rects.exit()
        .transition(transition().duration(500))
            .style('opacity', '0')
            .remove();

    const newRects = rects.enter()
        .append('rect')
            .call(rect => {
                rect.append('title')
                    .text(datum => datum.title);
            });

    rects.merge(newRects)
        .transition(transition().duration(20))
            .attr('x', datum => datum.x)
            .attr('y', datum => datum.y)
            .attr('width', datum => datum.width)
            .attr('height', datum => datum.height)
            .attr('fill', (datum, index) => {
                return `url(#lithology-60${index % 3 + 1})`;
                if (index % 3) {
                    return 'url(#lithology-601)';
                } else {
                    return 'url(#lithology-602)';
                }

                if (!datum.colors.length) {
                    return LITHOLOGY_COLORS[index % LITHOLOGY_COLORS.length];
                }
                return datum.colors[0];
            });

    return container;
}
