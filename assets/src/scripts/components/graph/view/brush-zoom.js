import { brushSelection, brushX } from 'd3-brush';
import { createStructuredSelector } from 'reselect';
import { event } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';

import { listen } from 'ngwmn/lib/d3-redux';
import { getChartPosition, getScaleX, getViewport, resetViewport, setViewport
} from '../state';


export default function (elem, store, mainChart, brushChart) {
    const brush = brushX()
        .handleSize(6);
    const gBrush = brushChart
        .append('g')
            .classed('brush', true);
    const zoom = d3Zoom()
        .scaleExtent([1, Infinity]);

    // Apply the zoom handlers to the main chart
    mainChart.call(zoom);

    listen(store, getChartPosition('main'), function (chartPosMain) {
        const extent = [[chartPosMain.x, chartPosMain.y], [chartPosMain.width, chartPosMain.height]];
        zoom.translateExtent(extent)
            .extent(extent);
    });

    // Update the brush extents in response to changes in the graph size.
    listen(store, getChartPosition('panner'), function (chartPosPanner) {
        // Set the extent
        brush.extent([[0, 0],
                     [chartPosPanner.width, chartPosPanner.height]]);
        // Apply the brush to the DOM
        gBrush.call(brush);
    }, true);

    zoom.on('zoom', function () {
        // Ignore zoom-by-brush
        if (event.sourceEvent && event.sourceEvent.type === 'brush') {
            return;
        }
        const xScalePanner = getScaleX('panner')(store.getState());
        const newDomain = event.transform.rescaleX(xScalePanner).domain();
        if (newDomain.every(isFinite)) {
            store.dispatch(setViewport(newDomain));

            // Update the brush with this new viewport location
            // We need to do this here, rather in response to viewport change,
            // to avoid an infinite loop.
            gBrush.call(brush.move, [
                xScalePanner(newDomain[0]),
                xScalePanner(newDomain[1])
            ]);
        }
    });

    // Update zoom transforms in response to viewport changes.
    listen(store, createStructuredSelector({
        xScalePanner: getScaleX('panner'),
        viewport: getViewport,
        chartPosMain: getChartPosition('main')
    }), function ({xScalePanner, viewport, chartPosMain}) {
        mainChart.call(zoom.transform, zoomIdentity
            .scale(chartPosMain.width / (xScalePanner(viewport[1]) - xScalePanner(viewport[0])))
            .translate(-xScalePanner(viewport[0]), 0));
    });

    // Attach a handler to the brush - depedent on the xScale, so reattach
    // every time we are called.
    // Apply d3-zoom listeners
    brush
        .on('brush end', function () {
            const state = store.getState();
            const xScalePanner = getScaleX('panner')(state);
            const chartPosMain = getChartPosition('main')(state);
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
        });
}
