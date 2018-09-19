import { select } from 'd3-selection';

import { get } from 'ngwmn/lib/ajax';


/**
 * Takes an external SVG and appends it into the document as a pattern with the
 * provided ID.
 * @param  {Object} store       Redux store (unused)
 * @param  {Object} node        DOM node to append pattern into
 * @param  {String} options.url URL of SVG document
 * @param  {String} options.id  ID to give to SVG pattern definition
 */
export default function (store, node, {url, id, multiplier = 2}) {
    get(url, 'responseXML').then(function (document) {
        const svgElem = document.documentElement;
        const width = parseFloat(svgElem.getAttribute('width')) * multiplier;
        const height = parseFloat(svgElem.getAttribute('height')) * multiplier;
        // Get svg string, with "#" escaped
        const svgStr = svgElem.outerHTML.replace(/#/g, '%23');
        select(node)
            .append('svg')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .attr('width', 0)
                .attr('height', 0)
                .attr('style', 'display: block')
                .append('defs')
                    .append('pattern')
                        .attr('id', id)
                        .attr('style', 'display: block')
                        .attr('patternUnits', 'userSpaceOnUse')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', width)
                        .attr('height', height)
                        .append('image')
                            .attr('xlink:href', `data:image/svg+xml;utf8,${svgStr}`)
                            .attr('width', width)
                            .attr('height', height);
    });
}
