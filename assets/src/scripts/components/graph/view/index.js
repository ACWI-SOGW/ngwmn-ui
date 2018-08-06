import { mouse } from 'd3-selection';
import { createStructuredSelector } from 'reselect';

import { link } from 'ngwmn/lib/d3-redux';
import { initCropper } from 'ngwmn/lib/utils';

import {
    getCurrentWaterLevelUnit, getCursor, getCursorPoint, getGraphSize,
    getLineSegments, getScaleX, getScaleY, setCursor, setGraphSize
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
export const drawChart = function (elem, store, className = 'chart') {
    const svg = elem.append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .classed('chart', true)
        .classed(className, true)
        .call(initCropper)
        .call(link(store, drawWaterLevels, createStructuredSelector({
            lineSegments: getLineSegments,
            xScale: getScaleX(className),
            yScale: getScaleY(className)
        })))
        .call(link(store, drawAxisY, createStructuredSelector({
            yScale: getScaleY(className)
        })))
        .call(link(store, drawAxisX, createStructuredSelector({
            xScale: getScaleX(className),
            layout: getGraphSize(className)
        })))
        .call(link(store, drawFocusLine, createStructuredSelector({
            cursor: getCursor,
            xScale: getScaleX(className),
            yScale: getScaleY(className)
        })))
        .call(link(store, drawFocusCircle, createStructuredSelector({
            cursorPoint: getCursorPoint,
            xScale: getScaleX(className),
            yScale: getScaleY(className)
        })))
        .call(svg => {
            svg.append('rect')
                .attr('class', 'overlay')
                .attr('x', 0)
                .attr('y', 0)
                .call(link(store, (rect, layout) => {
                    // Set the overlay size, including a little extra space to deal
                    // with the focus circle when it's drawn on the right-most extent.
                    rect.attr('width', layout.width + FOCUS_CIRCLE_RADIUS)
                        .attr('height', layout.height);
                }, getGraphSize(className)))
                .on('mouseout', () => {
                    //store.dispatch(setViewport(getCursor(store.getState())));
                    store.dispatch(setCursor(null));
                })
                /* SELECTION RECT HANDLING
                .on('mousedown', function () {
                    const location = mouse(this);
                    store.dispatch(setSelectionRect({
                        top: location[0],
                        left: location[1],
                        bottom: location[0],
                        right: location[1]
                    }));
                })
                .on('mouseup', function () {
                    store.dispatch(clearSelectionRect());
                })
                .on('mousemove.1', function () {
                    const selectionRect = getSelectionRect(store.getState());
                    if (selectionRect) {
                        const location = mouse(this);
                        store.dispatch(setSelectionRect({
                            top: selectionRect.top,
                            left: selectionRect.left,
                            //bottom: yScale.invert(location[0]),
                            //right: xScale.invert(location[1]),
                            bottom: location[0],
                            right: location[1]
                        }));
                    }
                })
                */
                .call(link(store, (rect, xScale) => {
                    rect.on('mouseover', () => {
                        const selectedTime = xScale.invert(mouse(rect.node())[0]);
                        store.dispatch(setCursor(selectedTime));
                    });
                    rect.on('mousemove.2', () => {
                        const selectedTime = xScale.invert(mouse(rect.node())[0]);
                        store.dispatch(setCursor(selectedTime));
                    });
                }, getScaleX(className)));
        });

    const node = svg.node();
    const refreshGraphSize = function () {
        const styles = window.getComputedStyle(node, null);
        store.dispatch(setGraphSize({
            graph: className,
            width: parseFloat(styles.getPropertyValue('width')),
            height: parseFloat(styles.getPropertyValue('height'))
        }));
    };
    refreshGraphSize();
    window.onresize = refreshGraphSize;
};

export default function (elem, store) {
    elem.append('div')
        .classed('graph-container', true)
        .call(link(store, drawAxisYLabel, createStructuredSelector({
            unit: getCurrentWaterLevelUnit
        })))
        .append('div')
            .classed('charts', true)
            .call(drawChart, store, 'main')
            .call(drawChart, store, 'brush')
            .call(link(store, drawTooltip, createStructuredSelector({
                cursorPoint: getCursorPoint,
                unit: getCurrentWaterLevelUnit
            })));
}
