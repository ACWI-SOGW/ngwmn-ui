import { mouse } from 'd3-selection';
import { createStructuredSelector } from 'reselect';
import ResizeObserver from 'resize-observer-polyfill';

import { link } from 'ngwmn/lib/d3-redux';
import { callIf } from 'ngwmn/lib/utils';
import { getSiteKey } from '../../../services/site-key';

import {
    getChartPoints, getChartPosition, getConstructionElements,
    getCurrentWaterLevelUnit, getCursor, getCursorDatum, getLineSegments,
    getLithology, getLithologyVisibility, getScaleX, getScaleY, getViewBox,
    getWellWaterLevel, setAxisYBBox, setCursor, setContainerSize
} from '../state';
import { drawAxisX, drawAxisY, drawAxisYLabel } from './axes';
import addBrushZoomBehavior from './brush-zoom';
import drawConstruction from './construction';
import { drawFocusCircle, drawFocusLine, drawTooltip } from './cursor';
import drawLegend from './legend';
import drawLithology from './lithology';
import drawWaterLevels from './water-levels';
import {getSelectedLithologyId} from "../../well-log/state";


/**
 * Draws a clipPath def that may be used to crop a chart to its defined content
 * area.
 * @param  {Object} elem      D3 selector to append to
 * @param  {Object} store     Redux store
 * @param  {String} chartType Kind of chart
 */
const drawClipPath = function (elem, store, opts, chartType) {
    elem.append('defs')
        .append('clipPath')
            .attr('id', `${chartType}-clip-path`)
            .append('rect')
                .call(link(store, (rect, chartPosition) => {
                    rect.attr('x', chartPosition.x)
                        .attr('y', chartPosition.y)
                        .attr('width', chartPosition.width)
                        .attr('height', chartPosition.height);
                }, getChartPosition(opts, chartType)));
};

const observeSize = function (elem, opts, store) {
    // Create an observer on the .chart-container node.
    // Here, we use a ResizeObserver polyfill to trigger redraws when
    // the CSS-driven size of our container changes.
    const node = elem.node();
    let size = {};
    const observer = new ResizeObserver(function (entries) {
        const newSize = {
            width: parseFloat(entries[0].contentRect.width),
            height: parseFloat(entries[0].contentRect.height)
        };
        if (size.width !== newSize.width || size.height !== newSize.height) {
            size = newSize;
            store.dispatch(setContainerSize(opts.id, size));
        }
    });
    observer.observe(node);
};

/**
 * Draws a water-levels graph.
 * @param  {Object} store   Redux store
 * @param  {Object} node    DOM node to draw graph into
 * @param  {Object} options {agencyCode, siteId} of site to draw
 */
const drawChart = function (elem, store, opts, chartType) {
    // Each chart gets its own group container, classed .chart
    return elem.append('g')
        .classed('chart', true)
        .classed(chartType, true)
        // Draw a clipPath on the chart to enable cropping of content to the
        // current domain.
        .call(drawClipPath, store, opts, chartType)
        .call(elem => {
            elem.append('g')
                .attr('clip-path', `url(#${chartType}-clip-path)`)
                // Draw well log lithology background
                .call(callIf(chartType !== 'construction', link(store, drawLithology, createStructuredSelector({
                    visible: getLithologyVisibility(opts),
                    lithology: getLithology(opts, chartType),
                    selectedLithologyId: getSelectedLithologyId(getSiteKey(opts.agencyCode, opts.siteId))
                }), store, getSiteKey(opts.agencyCode, opts.siteId))))
                .call(callIf(chartType === 'construction', link(store, drawConstruction, createStructuredSelector({
                    elements: getConstructionElements(opts, chartType),
                    cursorWaterLevel: getWellWaterLevel(opts, chartType)
                }), store, opts)))
                // Draw the actual lines/circles for the current water level data set.
                .call(callIf(chartType !== 'construction' && chartType !== 'lithology', link(store, drawWaterLevels, createStructuredSelector({
                    lineSegments: getLineSegments(opts),
                    chartPoints: getChartPoints(opts),
                    xScale: getScaleX(opts, chartType),
                    yScale: getScaleY(opts, chartType)
                }), chartType)))
                // Draw a vertical focus line representing the current cursor location.
                .call(callIf(chartType !== 'construction' && chartType !== 'lithology', link(store, drawFocusLine, createStructuredSelector({
                    cursor: getCursor(opts),
                    xScale: getScaleX(opts, chartType),
                    yScale: getScaleY(opts, chartType)
                }))))
                // Draw a circle around the point nearest the current cursor location.
                .call(callIf(chartType === 'main', link(store, drawFocusCircle, createStructuredSelector({
                    cursorPoint: getCursorDatum(opts),
                    xScale: getScaleX(opts, chartType),
                    yScale: getScaleY(opts, chartType)
                }))));
        })
        // Draw the y-axis, only for the main chart.
        .call(callIf(chartType === 'main', link(store, drawAxisY, createStructuredSelector({
            yScale: getScaleY(opts, chartType),
            layout: getChartPosition(opts, chartType)
        }), (bBox) => {
            // When the bounding box has changed, update the state with it.
            store.dispatch(setAxisYBBox(opts.id, bBox));
        })))
        // Draw the x-axis, only for the main chart.
        .call(callIf(chartType === 'main', link(store, drawAxisX, createStructuredSelector({
            xScale: getScaleX(opts, chartType),
            layout: getChartPosition(opts, chartType)
        }))))
        // To capture mouse events, draw an overlay rect and attach event
        // handlers to it.
        .call(callIf(chartType !== 'construction' && chartType !== 'lithology', g => {
            g.append('rect')
                .attr('class', 'overlay')
                // Set the overlay size, including a little extra space to deal
                // with the focus circle when it's drawn on the right-most extent.
                .call(link(store, (rect, layout) => {
                    rect.attr('x', layout.x)
                        .attr('y', layout.y)
                        .attr('width', layout.width)
                        .attr('height', layout.height);
                }, getChartPosition(opts, chartType)))
                // Set the cursor on mouseenter and clear on mouseout
                .call(link(store, (rect, xScale) => {
                    rect.on('mouseover', () => {
                        const selectedTime = xScale.invert(mouse(rect.node())[0]);
                        store.dispatch(setCursor(opts.siteKey, selectedTime));
                    });
                    rect.on('mousemove', () => {
                        const selectedTime = xScale.invert(mouse(rect.node())[0]);
                        store.dispatch(setCursor(opts.siteKey, selectedTime));
                    });
                    rect.on('mouseout', () => {
                        store.dispatch(setCursor(opts.siteKey, null));
                    });
                }, getScaleX(opts, chartType)));
        }));
};

/**
 * Attaches a well construction graph to a given DOM node.
 * @param  {Object} elem  D3 selector to render graph to
 * @param  {Object} store Redux store
 * @return {Object}       SVG node of rendered graph
 */
const drawConstructionGraph = (opts) => (elem, store) => {
    // Append the chart and axis labels, scoped to .chart-container
    elem.append('div')
        .classed('chart-container', true)
        .call(elem => {
            // Append an SVG container that we will draw to
            elem.append('svg')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .call(link(store, (svg, viewBox) => {
                    svg.attr('viewBox', `${viewBox.left} ${viewBox.top} ${viewBox.right - viewBox.left} ${viewBox.bottom - viewBox.top}`);
                }, getViewBox(opts)))
                .call(svg => {
                    // Draw the charts
                    drawChart(svg, store, opts, 'lithology');
                    drawChart(svg, store, opts, 'construction');
                });
        })
        .call(observeSize, opts, store);
};

/**
 * Attaches a water level graph to a given DOM node.
 * @param  {Object} elem  D3 selector to render graph to
 * @param  {Object} store Redux store
 * @return {Object}       SVG node of rendered graph
 */
const drawWaterLevelsGraph = (opts) => (elem, store) => {
    elem
        .append('div')
            .html('Water Levels, in feet below land surface')
            .classed('chart-title-container', true)
    // Append the chart and axis labels, scoped to .chart-container
    elem
        // Draw a tooltip container. This is rendered to the upper-right and
        // shows details of the point closest to the current cursor location.
        .call(link(store, drawTooltip, createStructuredSelector({
            cursorPoint: getCursorDatum(opts),
            unit: getCurrentWaterLevelUnit(opts)
        })))
        .append('div')
            .classed('chart-container', true)
            // Draw the y-axis label on the left of the chart.
            // See the SASS for the flexbox rules driving the layout.
            .call(link(store, drawAxisYLabel, createStructuredSelector({
                unit: getCurrentWaterLevelUnit(opts)
            })))
            .call(elem => {
                // Append an SVG container that we will draw to
                elem.append('svg')
                    .attr('xmlns', 'http://www.w3.org/2000/svg')
                    .call(link(store, (svg, viewBox) => {
                        svg.attr('viewBox', `${viewBox.left} ${viewBox.top} ${viewBox.right - viewBox.left} ${viewBox.bottom - viewBox.top}`);
                    }, getViewBox(opts)))
                    .call(svg => {
                        // Draw the charts
                        const brush = drawChart(svg, store, opts, 'brush');
                        const main = drawChart(svg, store, opts, 'main');

                        // Add interactive brush and zoom behavior over the charts
                        svg.call(addBrushZoomBehavior, store, opts, main, brush);
                    });
            })
            .call(observeSize, opts, store);

    // Append the legend
    drawLegend(elem, store, opts);
};

export default (opts) => (elem, store) => {
    // Append a container for the graph.
    // .graph-container is used to scope all the CSS styles.
    const graphContainer = elem
        .append('div')
            .classed('graph-container', true);

    if (opts.graphType === 'water-levels') {
        drawWaterLevelsGraph(opts)(graphContainer, store);
    } else if (opts.graphType === 'construction') {
        drawConstructionGraph(opts)(graphContainer, store);
    }
};
