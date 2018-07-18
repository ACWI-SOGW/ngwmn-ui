/**
 * This is an entrypoint for the Karma test runner. All tests should be
 * explicitly added here, or they won't be run as part of the test suite.
 *
 * This exists to speed up the execution time of the test suite. The
 * tests and the application dependencies only need to be compiled a single
 * time, and `karma --watch` tasks are very fast.
 */

import 'ngwmn/lib/ajax.spec';
import 'ngwmn/services/ngwmn.spec';
