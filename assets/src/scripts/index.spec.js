/**
 * This is an entrypoint for the Karma test runner. All tests should be
 * explicitly added here, or they won't be run as part of the test suite.
 *
 * This exists to speed up the execution time of the test suite. The
 * tests and the application dependencies only need to be compiled a single
 * time, and `karma --watch` tasks are very fast.
 */

import 'ngwmn/components/graph/index.spec.js';
import 'ngwmn/components/graph/state/cursor.spec.js';
import 'ngwmn/components/graph/state/layout.spec.js';
import 'ngwmn/components/graph/state/options.spec.js';
import 'ngwmn/components/graph/state/points.spec.js';
import 'ngwmn/components/graph/state/scales.spec.js';
import 'ngwmn/components/graph/state/well-log.spec.js';
import 'ngwmn/components/graph/view/axes.spec.js';
import 'ngwmn/components/graph/view/construction.spec.js';
import 'ngwmn/components/graph/view/cursor.spec.js';
import 'ngwmn/components/graph/view/domain-mapping.spec.js';
import 'ngwmn/components/graph/view/legend.spec.js';
import 'ngwmn/components/graph/view/lithology.spec.js';
import 'ngwmn/components/graph/view/water-levels.spec.js';
import 'ngwmn/components/svg-pattern/index.spec.js';
import 'ngwmn/components/water-level-table/index.spec.js';
import 'ngwmn/components/water-level-table/state.spec.js';
import 'ngwmn/components/well-log/index.spec.js';
import 'ngwmn/components/well-log/state.spec.js';
import 'ngwmn/lib/ajax.spec';
import 'ngwmn/lib/d3-redux.spec';
import 'ngwmn/lib/utils.spec';
import 'ngwmn/services/cache.spec';
import 'ngwmn/services/state/water-levels.spec';
import 'ngwmn/services/state/well-log.spec';
