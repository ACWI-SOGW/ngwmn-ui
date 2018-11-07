import { callIf } from 'ngwmn/lib/utils';

import { setSelectedConstructionId } from 'ngwmn/components/well-log/state';


const drawElement = function (store, elem, element, index) {
    elem.append('g')
        .attr('id', `${element.type}-${index}`)
        .classed(element.type, true)
        .classed('selected', element.isSelected)
        .call(elem => {
            elem.append('rect')
                .attr('x', element.left.x)
                .attr('y', element.left.y1)
                .attr('width', element.right.x - element.left.x)
                .attr('height', element.right.y2 - element.right.y1)
                .call(callIf(element.type === 'screen', (rect) => {
                    rect.attr('fill', `url(#screen-pattern-${index % 2})`);
                }))
                .append('title')
                    .text(element.title);
            elem.append('line')
                .attr('x1', element.left.x)
                .attr('y1', element.left.y1)
                .attr('x2', element.left.x)
                .attr('y2', element.left.y2)
                .attr('stroke-width', element.thickness);
            elem.append('line')
                .attr('x1', element.right.x)
                .attr('y1', element.right.y1)
                .attr('x2', element.right.x)
                .attr('y2', element.right.y2)
                .attr('stroke-width', element.thickness);
        })
        .on('mouseenter', function () {
            store.dispatch(setSelectedConstructionId(element.id));
        });
};

const drawWaterLevel = function (elem, elements, cursorWaterLevel) {
    // Don't draw anything if there is not a cursor datum.
    if (!cursorWaterLevel) {
        return;
    }

    const container = elem.append('g');

    container
        .append('clipPath')
            .attr('id', 'water-level-path')
            .call(path => {
                for (const element of elements) {
                    path.append('rect')
                        .attr('x', element.left.x)
                        .attr('y', element.left.y1)
                        .attr('width', element.right.x - element.left.x)
                        .attr('height', element.right.y2 - element.right.y1);
                }
            });
    container
        .append('rect')
            .attr('id', 'water-level')
            .attr('clip-path', 'url(#water-level-path)')
            .attr('x', cursorWaterLevel.x)
            .attr('y', cursorWaterLevel.y)
            .attr('width', cursorWaterLevel.width)
            .attr('height', cursorWaterLevel.height)
            .attr('fill', 'lightblue')
            .attr('fill-opacity', '0.85');
};

const drawPatterns = function (elem) {
    elem.append('defs')
        .call(defs => {
            defs.append('pattern')
                .attr('id', 'screen-pattern-0')
                .attr('width', '3')
                .attr('height', '3')
                .attr('patternUnits', 'userSpaceOnUse')
                .attr('patternTransform', 'rotate(45)')
                .append('rect')
                    .attr('width', '1')
                    .attr('height', '3')
                    .attr('fill', 'gray')
                    .attr('transform', 'translate(0, 0)');
            defs.append('pattern')
                .attr('id', 'screen-pattern-1')
                .attr('width', '3')
                .attr('height', '3')
                .attr('patternUnits', 'userSpaceOnUse')
                .attr('patternTransform', 'rotate(-45)')
                .append('rect')
                    .attr('width', '1')
                    .attr('height', '3')
                    .attr('fill', 'gray')
                    .attr('transform', 'translate(0, 0)');
        });
};

export default function (elem, {elements, cursorWaterLevel}, store, container) {
    // Get/create container for construction elements
    container = container || elem
        .call(drawPatterns)
        .append('g')
            .classed('construction', true);

    // Remove any previously drawn children
    container.selectAll('*').remove();

    // Draw the current cursor water level inside the well chamber
    drawWaterLevel(container, elements, cursorWaterLevel);

    // Draw each construction element
    elements.forEach((element, index) => {
        drawElement(store, container, element, index);
    });

    return container;
}
