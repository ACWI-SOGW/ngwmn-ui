import { mouse } from 'd3-selection';
import { createStructuredSelector } from 'reselect';

import { link } from 'ngwmn/lib/d3-redux';
import { initCropper } from 'ngwmn/lib/utils';

import {
    getCurrentWaterLevels, getCurrentWaterLevelUnit, getCursor, getCursorPoint,
    getLayout, getLineSegments, getScaleX, getScaleY, setCursor
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
export default function (elem, store) {
    elem.call(link(store, (elem, waterLevels) => {
            elem.classed('loading', !waterLevels || !waterLevels.samples)
                .classed('has-error', waterLevels && waterLevels.error);
        }, getCurrentWaterLevels))
        .append('div')
            .classed('graph-container', true)
            .call(link(store, drawAxisYLabel, createStructuredSelector({
                unit: getCurrentWaterLevelUnit
            })))
            .call(link(store, drawTooltip, createStructuredSelector({
                cursorPoint: getCursorPoint,
                unit: getCurrentWaterLevelUnit

            })))
            .append('svg')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .classed('chart', true)
                .call(initCropper)
                .call(link(store, drawWaterLevels, createStructuredSelector({
                    lineSegments: getLineSegments,
                    xScale: getScaleX,
                    yScale: getScaleY
                })))
                .call(link(store, drawAxisY, createStructuredSelector({
                    yScale: getScaleY
                })))
                .call(link(store, drawAxisX, createStructuredSelector({
                    xScale: getScaleX,
                    layout: getLayout
                })))
                .call(link(store, drawFocusLine, createStructuredSelector({
                    cursor: getCursor,
                    xScale: getScaleX,
                    yScale: getScaleY
                })))
                .call(link(store, drawFocusCircle, createStructuredSelector({
                    cursorPoint: getCursorPoint,
                    xScale: getScaleX,
                    yScale: getScaleY
                })))
                .append('rect')
                    .attr('class', 'overlay')
                    .attr('x', 0)
                    .attr('y', 0)
                    .call(link(store, (rect, layout) => {
                        // Set the overlay size, including a little extra space to deal
                        // with the focus circle when it's drawn on the right-most extent.
                        rect.attr('width', layout.width + FOCUS_CIRCLE_RADIUS)
                            .attr('height', layout.height);
                    }, getLayout))
                    .on('mouseout', () => {
                        store.dispatch(setCursor(null));
                    })
                    .call(link(store, (rect, xScale) => {
                        rect.on('mouseover', () => {
                            const selectedTime = xScale.invert(mouse(rect.node())[0]);
                            store.dispatch(setCursor(selectedTime));
                        });
                        rect.on('mousemove', () => {
                            const selectedTime = xScale.invert(mouse(rect.node())[0]);
                            store.dispatch(setCursor(selectedTime));
                        });
                    }, getScaleX));
}
