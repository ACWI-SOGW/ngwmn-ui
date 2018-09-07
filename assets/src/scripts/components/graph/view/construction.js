const drawCasing = function (elem, casing, index) {
    elem.append('rect')
        .attr('id', `casing-${index}`)
        .attr('x', casing.x)
        .attr('y', casing.y)
        .attr('width', casing.width)
        .attr('height', casing.height)
        .attr('fill', 'white')
        .attr('stroke', 'wheat')
        .attr('stroke-width', 8)
        .attr('rx', 5)
        .attr('ry', 5);
};

const drawScreen = function (elem, screen, index) {
    elem.append('rect')
        .attr('id', `screen-${index}`)
        .attr('x', screen.x)
        .attr('y', screen.y)
        .attr('width', screen.width)
        .attr('height', screen.height)
        .attr('fill', 'url(#screen-pattern)')
        .attr('rx', 5)
        .attr('ry', 5);
};

const drawWaterLevel = function (elem, cursorWaterLevel) {
    // Don't draw anything if there is not a cursor datum.
    if (!cursorWaterLevel) {
        return;
    }

    elem.append('rect')
        .attr('id', 'water-level')
        .attr('x', cursorWaterLevel.x)
        .attr('y', cursorWaterLevel.y)
        .attr('width', cursorWaterLevel.width)
        .attr('height', cursorWaterLevel.height)
        .attr('fill', 'lightblue');
};

const drawPatterns = function (elem) {
    elem.append('defs')
        .call(defs => {
            defs.append('mask')
                .attr('id', 'screen-mask')
                .attr('maskUnits', 'userSpaceOnUse')
                .append('rect')
                    .attr('x', '0')
                    .attr('y', '0')
                    .attr('width', '100%')
                    .attr('height', '100%')
                    .attr('fill', '#0000ff');

            defs.append('pattern')
                .attr('id', 'screen-pattern')
                .attr('width', '3')
                .attr('height', '3')
                .attr('patternUnits', 'userSpaceOnUse')
                .attr('patternTransform', 'rotate(45)')
                .append('rect')
                    .attr('width', '1')
                    .attr('height', '3')
                    .attr('transform', 'translate(0, 0)')
                    .attr('mask', 'url(#screen-mask)');
        });
};

export default function (elem, {casings, screens, cursorWaterLevel}, container) {
    // Get/create container for construction elements
    container = container || elem
        .call(drawPatterns)
        .append('g')
            .classed('construction', true);

    // Remove any previously drawn children
    container.selectAll('*').remove();

    // Draw each casing
    casings.forEach((casing, index) => drawCasing(container, casing, index));

    // Draw the current cursor water level inside the well chamber
    drawWaterLevel(container, cursorWaterLevel);

    // Draw each screen
    screens.forEach((screen, index) => drawScreen(container, screen, index));

    return container;
}
