import { brushSelection, brushX } from 'd3-brush';
import { createStructuredSelector } from 'reselect';
import { event } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';

import { listen } from 'ngwmn/lib/d3-redux';
import { getChartPosition, getScaleX, getViewport, resetViewport, setViewport
} from '../state';


export default function (elem, store, opts, mainChart, brushChart) {
    const brush = brushX()
        .handleSize(6);
    const gBrush = brushChart
        .append('g')
            .classed('brush', true);
    const zoom = d3Zoom()
        .scaleExtent([1, 10000]);
    mainChart
        .classed('zoom', true);

    // Apply the zoom handlers to the main chart
    mainChart.call(zoom);

    listen(store, getChartPosition('main'), function (chartPosMain) {
        const extent = [[chartPosMain.x, chartPosMain.y], [chartPosMain.width, chartPosMain.height]];
        zoom.translateExtent(extent)
            .extent(extent);
    });

    // Update the brush extents in response to changes in the graph size.
    listen(store, getChartPosition('brush'), function (chartPosBrush) {
        brush.extent([[chartPosBrush.x, chartPosBrush.y],
                     [chartPosBrush.x + chartPosBrush.width, chartPosBrush.y + chartPosBrush.height]]);
        // Apply the brush to the DOM
        gBrush.call(brush);
    });

    zoom.on('zoom', function () {
        // Ignore zoom-by-brush
        if (event.sourceEvent && event.sourceEvent.type === 'brush') {
            return;
        }
        const xScaleBrush = getScaleX(opts, 'brush')(store.getState());
        const newDomain = event.transform.rescaleX(xScaleBrush).domain();
        if (newDomain.every(isFinite)) {
            store.dispatch(setViewport(newDomain));

            // Update the brush with this new viewport location
            // We need to do this here, rather in response to viewport change,
            // to avoid an infinite loop.
            gBrush.call(brush.move, [
                xScaleBrush(newDomain[0]),
                xScaleBrush(newDomain[1])
            ]);
        }
    });

    // Update zoom transforms in response to viewport changes.
    listen(store, createStructuredSelector({
        xScaleBrush: getScaleX(opts, 'brush'),
        viewport: getViewport(opts),
        chartPosMain: getChartPosition('main')
    }), function ({xScaleBrush, viewport, chartPosMain}) {
        mainChart
            .call(zoom.transform, zoomIdentity
            .scale(chartPosMain.width / (xScaleBrush(viewport[1]) - xScaleBrush(viewport[0])))
            .translate(-xScaleBrush(viewport[0]), 0));
    });

    // Attach a handler to the brush - depedent on the xScale, so reattach
    // every time we are called.
    // Apply d3-zoom listeners
    brush
        .on('brush end', function () {
            const state = store.getState();
            const xScaleBrush = getScaleX(opts, 'brush')(state);
            const chartPosMain = getChartPosition('main')(state);
            // Ignore brush-by-zoom
            if (event.sourceEvent && event.sourceEvent.type === 'zoom') {
                return;
            }
            const selection = brushSelection(this);
            if (selection) {
                const selectionDomain = selection ? [
                    xScaleBrush.invert(selection[0]),
                    xScaleBrush.invert(selection[1])
                ] : [];
                store.dispatch(setViewport(selectionDomain));
                mainChart
                    .call(zoom.transform, zoomIdentity
                    .scale(chartPosMain.width / (selection[1] - selection[0]))
                    .translate(-selection[0], 0));
            } else {
                store.dispatch(resetViewport());
            }
        });
}
