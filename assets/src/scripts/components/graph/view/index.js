import { mouse } from 'd3-selection';
import { createStructuredSelector } from 'reselect';
import ResizeObserver from 'resize-observer-polyfill';

import { link } from 'ngwmn/lib/d3-redux';
import { callIf } from 'ngwmn/lib/utils';

import {
    getActiveClasses, getCasings, getChartPoints, getChartPosition,
    getCurrentWaterLevelUnit, getCursor, getCursorDatum, getLineSegments,
    getLithology, getScaleX, getScaleY, getScreens, getViewBox,
    getWellWaterLevel, setAxisYBBox, setCursor, setContainerSize
} from '../state';
import { drawAxisX, drawAxisY, drawAxisYLabel } from './axes';
import addBrushZoomBehavior from './brush-zoom';
import drawConstruction from './construction';
import { drawFocusCircle, drawFocusLine, drawTooltip } from './cursor';
import drawDomainMapping from './domain-mapping';
import drawLegend from './legend';
import drawLithology from './lithology';
import drawWaterLevels from './water-levels';


/**
 * Draws a clipPath def that may be used to crop a chart to its defined content
 * area.
 * @param  {Object} elem      D3 selector to append to
 * @param  {Object} store     Redux store
 * @param  {String} chartType Kind of chart
 */
const drawClipPath = function (elem, store, chartType) {
    elem.append('defs')
        .append('clipPath')
            .attr('id', `${chartType}-clip-path`)
            .append('rect')
                .call(link(store, (rect, chartPosition) => {
                    rect.attr('x', chartPosition.x)
                        .attr('y', chartPosition.y)
                        .attr('width', chartPosition.width)
                        .attr('height', chartPosition.height);
                }, getChartPosition(chartType)));
};

/**
 * Draws a water-levels graph.
 * @param  {Object} store   Redux store
 * @param  {Object} node    DOM node to draw graph into
 * @param  {Object} options {agencycode, siteid} of site to draw
 */
const drawChart = function (elem, store, chartType) {
    // Each chart gets its own group container, classed .chart
    return elem.append('g')
        .classed('chart', true)
        .classed(chartType, true)
        // Draw a clipPath on the chart to enable cropping of content to the
        // current domain.
        .call(drawClipPath, store, chartType)
        .call(elem => {
            elem.append('g')
                .attr('clip-path', `url(#${chartType}-clip-path)`)
                // Draw well log lithology background
                .call(link(store, drawLithology, createStructuredSelector({
                    lithology: getLithology(chartType)
                })))
                .call(callIf(chartType === 'lithology', link(store, drawConstruction, createStructuredSelector({
                    screens: getScreens(chartType),
                    casings: getCasings(chartType),
                    cursorWaterLevel: getWellWaterLevel(chartType)
                }))))
                // Draw the actual lines/circles for the current water level data set.
                .call(link(store, drawWaterLevels, createStructuredSelector({
                    lineSegments: getLineSegments,
                    chartPoints: getChartPoints,
                    xScale: getScaleX(chartType),
                    yScale: getScaleY(chartType)
                }), chartType))
                // Draw a vertical focus line representing the current cursor location.
                .call(link(store, drawFocusLine, createStructuredSelector({
                    cursor: getCursor,
                    xScale: getScaleX(chartType),
                    yScale: getScaleY(chartType)
                })))
                // Draw a circle around the point nearest the current cursor location.
                .call(callIf(chartType === 'main', link(store, drawFocusCircle, createStructuredSelector({
                    cursorPoint: getCursorDatum,
                    xScale: getScaleX(chartType),
                    yScale: getScaleY(chartType)
                }))));
        })
        // Draw the y-axis, only for the main chart.
        .call(callIf(chartType === 'main', link(store, drawAxisY, createStructuredSelector({
            yScale: getScaleY(chartType),
            layout: getChartPosition(chartType)
        }), (bBox) => {
            // When the bounding box has changed, update the state with it.
            store.dispatch(setAxisYBBox(bBox));
        })))
        // Draw the x-axis, only for the main chart.
        .call(callIf(chartType === 'main', link(store, drawAxisX, createStructuredSelector({
            xScale: getScaleX(chartType),
            layout: getChartPosition(chartType)
        }))))
        // To capture mouse events, draw an overlay rect and attach event
        // handlers to it.
        .call(g => {
            g.append('rect')
                .attr('class', 'overlay')
                // Set the overlay size, including a little extra space to deal
                // with the focus circle when it's drawn on the right-most extent.
                .call(link(store, (rect, layout) => {
                    rect.attr('x', layout.x)
                        .attr('y', layout.y)
                        .attr('width', layout.width)
                        .attr('height', layout.height);
                }, getChartPosition(chartType)))
                // Clear the cursor on mouseout
                .on('mouseout', () => {
                    store.dispatch(setCursor(null));
                })
                // Set the cursor on mousemove and mouseover
                .call(link(store, (rect, xScale) => {
                    rect.on('mouseover', () => {
                        const selectedTime = xScale.invert(mouse(rect.node())[0]);
                        store.dispatch(setCursor(selectedTime));
                    });
                    rect.on('mousemove', () => {
                        const selectedTime = xScale.invert(mouse(rect.node())[0]);
                        store.dispatch(setCursor(selectedTime));
                    });
                }, getScaleX(chartType)));
        });
};

/**
 * Attaches a water level graph to a given DOM node.
 * @param  {Object} elem  D3 selector to render graph to
 * @param  {Object} store Redux store
 * @return {Object}       SVG node of rendered graph
 */
export default function (elem, store) {
    // Append a container for the graph.
    // .graph-container is used to scope all the CSS styles.
    const graphContainer = elem.append('div')
        .classed('graph-container', true);

    // Append the chart and axis labels, scoped to .chart-container
    graphContainer.append('div')
        .classed('chart-container', true)
        // Draw the y-axis label on the left of the chart.
        // See the SASS for the flexbox rules driving the layout.
        .call(link(store, drawAxisYLabel, createStructuredSelector({
            unit: getCurrentWaterLevelUnit
        })))
        .call(elem => {
            // Append an SVG container that we will draw to
            elem.append('svg')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .call(link(store, (svg, viewBox) => {
                    svg.attr('viewBox', `${viewBox.left} ${viewBox.top} ${viewBox.right - viewBox.left} ${viewBox.bottom - viewBox.top}`);
                }, getViewBox))
                .call(svg => {
                    // Draw the charts
                    const brush = drawChart(svg, store, 'brush');
                    const main = drawChart(svg, store, 'main');
                    drawChart(svg, store, 'lithology');

                    // Draw a key mapping the domain on the main chart to the
                    // lithology chart.
                    svg.call(link(store, drawDomainMapping, createStructuredSelector({
                        xScaleFrom: getScaleX('main'),
                        yScaleFrom: getScaleY('main'),
                        xScaleTo: getScaleX('lithology'),
                        yScaleTo: getScaleY('lithology')
                    })));

                    // Add interactive brush and zoom behavior over the charts
                    svg.call(addBrushZoomBehavior, store, main, brush);
                });
        })
        // Draw a tooltip container. This is rendered to the upper-right and
        // shows details of the point closest to the current cursor location.
        .call(link(store, drawTooltip, createStructuredSelector({
            cursorPoint: getCursorDatum,
            unit: getCurrentWaterLevelUnit
        })))
        .call(div => {
            // Create an observer on the .chart-container node.
            // Here, we use a ResizeObserver polyfill to trigger redraws when
            // the CSS-driven size of our container changes.
            const node = div.node();
            let size = {};
            const observer = new ResizeObserver(function (entries) {
                const newSize = {
                    width: parseFloat(entries[0].contentRect.width),
                    height: parseFloat(entries[0].contentRect.height)
                };
                if (size.width !== newSize.width || size.height !== newSize.height) {
                    size = newSize;
                    store.dispatch(setContainerSize(size));
                }
            });
            observer.observe(node);
        });

    // Append the legend
    graphContainer
        .call(link(store, drawLegend, getActiveClasses));
}
