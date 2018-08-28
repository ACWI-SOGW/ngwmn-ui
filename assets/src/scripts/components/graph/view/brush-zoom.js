import { brushSelection, brushX } from 'd3-brush';
import { event } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';

import { resetViewport, setViewport } from '../state';


export default function (elem, {viewport, xScalePanner, chartPosMain, chartPosPanner}, store, mainChart, brushChart, context) {
    context = context || {};
    const brush = context.brush || brushX()
        .handleSize(6);
    const gBrush = context.gBrush || brushChart
        .append('g')
            .classed('brush', true);
    const zoom = context.zoom || d3Zoom()
        .scaleExtent([1, Infinity]);

    const extent = [[chartPosMain.x, chartPosMain.y], [chartPosMain.width, chartPosMain.height]];
    zoom.translateExtent(extent)
        .extent(extent);

    zoom.on('zoom', function () {
        // Ignore zoom-by-brush
        if (event.sourceEvent && event.sourceEvent.type === 'brush') {
            return;
        }
        const newDomain = event.transform.rescaleX(xScalePanner).domain();
        // Only update the viewport if it has valid and has changed
        if (isFinite(newDomain[0]) && isFinite(newDomain[1]) &&
                (viewport[0] !== newDomain[0] || viewport[1] !== newDomain[1])) {
            store.dispatch(setViewport(newDomain));
            gBrush.call(brush.move, [
                xScalePanner(newDomain[0]),
                xScalePanner(newDomain[1])
            ]);
        }
    });

    // Apply d3-zoom listeners
    mainChart.call(zoom);
    mainChart.call(zoom.transform, zoomIdentity
        .scale(chartPosMain.width / (xScalePanner(viewport[1]) - xScalePanner(viewport[0])))
        .translate(-xScalePanner(viewport[0]), 0));

    // Attach a handler to the brush - depedent on the xScale, so reattach
    // every time we are called.
    brush
        .on('brush end', function () {
            // Ignore brush-by-zoom
            if (event.sourceEvent && event.sourceEvent.type === 'zoom') {
                return;
            }
            const selection = brushSelection(this);
            if (selection) {
                const selectionDomain = selection ? [
                    xScalePanner.invert(selection[0]),
                    xScalePanner.invert(selection[1])
                ] : [];
                store.dispatch(setViewport(selectionDomain));
                mainChart.call(zoom.transform, zoomIdentity
                    .scale(chartPosMain.width / (selection[1] - selection[0]))
                    .translate(-selection[0], 0));
            } else {
                store.dispatch(resetViewport());
            }
        })
        .extent([[0, 0],
                 [chartPosPanner.width, chartPosPanner.height]]);

    // Apply the brush to the DOM
    gBrush.call(brush);

    return {
        brush,
        gBrush,
        zoom
    };
}
