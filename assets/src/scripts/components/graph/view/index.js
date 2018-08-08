import { brushSelection, brushX } from 'd3-brush';
import { mouse } from 'd3-selection';
import { createStructuredSelector } from 'reselect';

import { link } from 'ngwmn/lib/d3-redux';
import { callIf } from 'ngwmn/lib/utils';

import {
    getChartPosition, getCurrentWaterLevelUnit, getCursor, getCursorPoint,
    getLineSegments, getScaleX, getScaleY, resetViewport, setCursor,
    setContainerSize, setViewport
} from '../state';
import { drawAxisX, drawAxisY, drawAxisYLabel } from './axes';
import { drawFocusCircle, drawFocusLine, drawTooltip, FOCUS_CIRCLE_RADIUS } from './cursor';
import drawWaterLevels from './water-levels';


/**
 * Draws a water-levels graph.
 * @param  {Object} store   Redux store
 * @param  {Object} node    DOM node to draw graph into
 * @param  {Object} options {agencycode, siteid} of site to draw
 */
export const drawChart = function (elem, store, chartType = 'chart') {
    elem.append('g')
        .classed('chart', true)
        .classed(chartType, true)
        .call(link(store, (elem, pos) => {
            elem.attr('transform', `translate(${pos.x}, ${pos.y})`);
        }, getChartPosition(chartType)))
        .call(link(store, drawWaterLevels, createStructuredSelector({
            lineSegments: getLineSegments,
            xScale: getScaleX(chartType),
            yScale: getScaleY(chartType)
        })))
        .call(callIf(chartType === 'main', link(store, drawAxisY, createStructuredSelector({
            yScale: getScaleY(chartType)
        }))))
        .call(callIf(chartType === 'main', link(store, drawAxisX, createStructuredSelector({
            xScale: getScaleX(chartType),
            layout: getChartPosition(chartType)
        }))))
        .call(link(store, drawFocusLine, createStructuredSelector({
            cursor: getCursor(chartType),
            xScale: getScaleX(chartType),
            yScale: getScaleY(chartType)
        })))
        .call(link(store, drawFocusCircle, createStructuredSelector({
            cursorPoint: getCursorPoint(chartType),
            xScale: getScaleX(chartType),
            yScale: getScaleY(chartType)
        })))
        .call(g => {
            g.append('rect')
                .attr('class', 'overlay')
                .attr('x', 0)
                .attr('y', 0)
                .call(link(store, (rect, layout) => {
                    // Set the overlay size, including a little extra space to deal
                    // with the focus circle when it's drawn on the right-most extent.
                    rect.attr('width', layout.width + FOCUS_CIRCLE_RADIUS)
                        .attr('height', layout.height);
                }, getChartPosition(chartType)))
                .on('mouseout', () => {
                    //store.dispatch(setViewport(getCursor(store.getState())));
                    store.dispatch(setCursor(null));
                })
                .call(link(store, (rect, xScale) => {
                    rect.on('mouseover', () => {
                        const selectedTime = xScale.invert(mouse(rect.node())[0]);
                        store.dispatch(setCursor(selectedTime));
                    });
                    rect.on('mousemove.2', () => {
                        const selectedTime = xScale.invert(mouse(rect.node())[0]);
                        store.dispatch(setCursor(selectedTime));
                    });
                }, getScaleX(chartType)));
        })
        // .call(link(store, (elem, scaleX) => {
        //     const zoomBehavior = zoom().on(`zoom.${chartType}`, function () {
        //         // Ignore zoom-by-brush
        //         if (event.sourceEvent && event.sourceEvent.type === 'brush') {
        //             return;
        //         }
        //         var t = event.transform;
        //         scaleX.domain(t.rescaleX(scaleX).domain());
        //         //focus.select('.area').attr('d', area);
        //         //focus.select(".axis--x").call(xAxis);
        //         //context.select(".brush").call(brush.move, x.range().map(t.invertX, t));

        //         //console.log(event);
        //         //elem.attr('transform', event.transform);
        //         //console.log(event.transform);
        //         /*elem.call(
        //             event.transform,
        //             zoomIdentity
        //                 .scale(5)
        //                 .translate([-10, 0])
        //         );*/
        //         //console.log(event.target.extent().call(this));
        //     });
        //     zoomBehavior(elem);
        // }, getScaleX(chartType)))
        .call(callIf(chartType === 'panner', link(store, (elem, {chartPos, scaleX}, context) => {
            const gBrush = context ? context.gBrush : elem
                .append('g')
                    .classed('brush', true);
            const brush = context ? context.brush : brushX()
                .handleSize(1);

            brush
                .on('brush.panner end.panner', function () {
                    const selection = brushSelection(this);
                    if (selection) {
                        store.dispatch(setViewport({
                            startDate: scaleX.invert(selection[0]),
                            endDate: scaleX.invert(selection[1])
                        }));
                    } else {
                        store.dispatch(resetViewport());
                    }
                })
                .extent([[0, 0],
                         [chartPos.width, chartPos.height]]);

            gBrush.call(brush);
            return {gBrush, brush};
        }, createStructuredSelector({
            chartPos: getChartPosition(chartType),
            scaleX: getScaleX(chartType)
        }))));
};

export default function (elem, store) {
    const svg = elem.append('div')
        .classed('graph-container', true)
        .call(link(store, drawAxisYLabel, createStructuredSelector({
            unit: getCurrentWaterLevelUnit
        })))
        .call(elem => {
            elem.append('svg')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                //.call(initCropper)
                .call(drawChart, store, 'main')
                .call(drawChart, store, 'panner');
                //.call(drawChart, store, 'lithography');
        })
        .call(link(store, drawTooltip, createStructuredSelector({
            cursorPoint: getCursorPoint('main'),
            unit: getCurrentWaterLevelUnit
        })));

    const node = svg.node();
    const refreshGraphSize = function () {
        const styles = window.getComputedStyle(node, null);
        store.dispatch(setContainerSize({
            width: parseFloat(styles.getPropertyValue('width')),
            height: parseFloat(styles.getPropertyValue('height'))
        }));
    };
    refreshGraphSize();
    window.onresize = refreshGraphSize;

    return svg;
}
