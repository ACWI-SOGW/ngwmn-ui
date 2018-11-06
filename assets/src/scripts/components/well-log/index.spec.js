import { select } from 'd3-selection';

import getMockStore from 'ngwmn/store.mock';
import attachToNode from './index';


const MOCK_COMPONENT = `<div class="ngwmn-component" data-component="well-log">
    <h3>Well Construction</h3>
    <input type="radio" name="construction-type" value="all" id="all" checked="">
    <label for="all">All</label>
    <input type="radio" name="construction-type" value="screens" id="screens">
    <label for="screens">Screens</label>
    <input type="radio" name="construction-type" value="casings" id="casings">
    <label for="casings">Casings</label>
    <table class="usa-table-borderless">
        <thead>
            <tr>
                <th scope="col"></th>
                <th scope="col">Depth</th>
                <th scope="col">Description</th>
            </tr>
        </thead>
        <tbody>
            <tr class="casing" data-local-id="casing-0">
                <td>
                    <svg width="30" height="30" viewBox="0 0 30 30">
                        <line x1="15" y1="0" x2="15" y2="30" stroke-width="2" stroke="gray"></line>
                    </svg>
                </td>
                <td>0.0-220.0 ft</td>
                <td>
                    10.0 in diameter
                    steel
                    casing
                </td>
            </tr>
            <tr class="screen" data-local-id="screen-0">
                <td>
                    <svg width="30" height="30" viewBox="0 0 30 30">
                        <rect width="30" height="30" fill="url(#screen-pattern-1)"></rect>
                    </svg>
                </td>
                <td>220.0-250.0 ft</td>
                <td>
                    12.0 in diameter
                    screen
                </td>
            </tr>
            <tr class="screen" data-local-id="screen-1">
                <td>
                    <svg width="30" height="30" viewBox="0 0 30 30">
                        <rect width="30" height="30" fill="url(#screen-pattern-0)"></rect>
                    </svg>
                </td>
                <td>227.0-250.0 ft</td>
                <td>
                    12.0 in diameter
                    screen
                </td>
            </tr>
            <tr class="screen" data-local-id="screen-2">
                <td>
                    <svg width="30" height="30" viewBox="0 0 30 30">
                        <rect width="30" height="30" fill="url(#screen-pattern-1)"></rect>
                    </svg>
                </td>
                <td>250.0-392.0 ft</td>
                <td>
                    10.0 in diameter
                    screen
                </td>
            </tr>
        </tbody>
    </table>
</div>
`;

describe('well-log component', () => {
    let div;
    let store;

    beforeEach(() => {
        div = select('body')
            .html(MOCK_COMPONENT);
        store = getMockStore();
    });

    afterEach(() => {
        div.remove();
    });

    it('renders without crashing', () => {
        const node = div.node();
        attachToNode(store, node, node.dataset);
    });
});
