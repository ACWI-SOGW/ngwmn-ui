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
            .classed('lithology', true);

    // Remove any previously drawn children
    container.selectAll('*').remove();

    for (let i = 0; i < lithology.length; i++) {
        const layer = lithology[i];
        container
            .append('rect')
                .call(rect => {
                    rect.append('title')
                        .text(layer.title);
                })
                .attr('x', layer.x)
                .attr('y', layer.y)
                .attr('width', layer.width)
                .attr('height', layer.height)
                .attr('fill', `url(#lithology-${layer.materials[0]})`)
                .attr('color', () => {
                    if (!layer.colors.length) {
                        return LITHOLOGY_COLORS[i % LITHOLOGY_COLORS.length];
                    }
                    return layer.colors[0];
                });
    }

    return container;
}
