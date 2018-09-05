import { linkHorizontal } from 'd3-shape';


const link = linkHorizontal();

export default function (elem, {xScaleFrom, xScaleTo, yScaleFrom, yScaleTo}, context) {
    context = context || {};
    const domainTopLine = context.domainTopLine || elem
        .append('path')
            .classed('domain-mapping', true);
    const domainBottomLine = context.domainBottomLine || elem
        .append('path')
            .classed('domain-mapping', true);

    const yDomain = yScaleFrom.domain();
    domainTopLine
        .datum({
            source: [xScaleFrom.range()[1] || 0, yScaleFrom(yDomain[0]) || 0],
            target: [xScaleTo.range()[0] || 0, yScaleTo(yDomain[0]) || 0]
        })
        .attr('d', link);

    domainBottomLine
        .datum({
            source: [xScaleFrom.range()[1] || 0, yScaleFrom(yDomain[1]) || 0],
            target: [xScaleTo.range()[0] || 0, yScaleTo(yDomain[1]) || 0]
        })
        .attr('d', link);

    return {
        domainTopLine,
        domainBottomLine
    };
}
