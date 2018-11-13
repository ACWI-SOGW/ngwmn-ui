import { select } from 'd3-selection';

import attachToNode from './index';


const MOCK_SVG = `<!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In  -->
<svg version="1.1"
       xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
       x="0px" y="0px" width="53.2px" height="53.4px" viewBox="0 0 53.2 53.4" style="enable-background:new 0 0 53.2 53.4;"
       xml:space="preserve">
<style type="text/css">
      .st0{fill:none;stroke:#000000;stroke-width:0.7;stroke-linecap:round;}
      .st1{fill:none;stroke:#000000;stroke-width:0.3;}
</style>
<defs>
</defs>
<line class="st0" x1="25.1" y1="26.2" x2="25.1" y2="26.2"/>
</svg>`;

describe('svg pattern component', () => {
    let div;

    beforeEach(() => {
        div = select('body')
            .append('div')
                .attr('id', 'div-container');
        jasmine.Ajax.install();
    });

    afterEach(() => {
        div.remove();
        jasmine.Ajax.uninstall();
    });

    it('renders SVG pattern definition with correct width and height', () => {
        attachToNode(null, div.node(), {url: 'http://test.com/my.svg', domId: 'my-id'});
        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: MOCK_SVG,
            contentType: 'text/xml'
        });
        window.setTimeout(() => {
            expect(div.selectAll('svg').size()).toEqual(1);
            expect(div.selectAll('pattern').size()).toEqual(1);
            const pattern = div.select('pattern');
            expect(pattern.attr('width')).toEqual('106.4');
            expect(pattern.attr('height')).toEqual('106.8');
            expect(pattern.attr('id')).toEqual('my-id');
            const image = pattern.select('image');
            expect(image.attr('width')).toEqual('106.4');
            expect(image.attr('height')).toEqual('106.8');
        });
    });
});
