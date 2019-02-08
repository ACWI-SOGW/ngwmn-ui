/* global process, module */
const istanbul = require('rollup-plugin-istanbul');


function isDebug(argument) {
    return argument === '--debug';
}


module.exports = function (config) {
    /**
     * Base configuration shared by all run configurations
     */
    let karmaConfig = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine-ajax', 'jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'tests/scripts/config.js',
            'src/scripts/index.spec.js'
        ],


        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/scripts/**/*.js': ['rollup']
        },

        rollupPreprocessor: {
            /**
             * This is just a normal Rollup config object,
             * except that `input` is handled for you.
             */
            ...require('./rollup.config')
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['FirefoxHeadless'],
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless']
            }
        },


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // After upgrading to Jasmine 3.x, the tests fail when run in random
        // order. Need to track down why this is the case.
        client: {
            jasmine: {
                random: true
            }
        }
    };

    /**
     * Produce a code coverage report
     */
    if (!process.argv.some(isDebug)) {
        karmaConfig = {
            ...karmaConfig,
            rollupPreprocessor: {
                ...karmaConfig.rollupPreprocessor,
                plugins: [
                    ...karmaConfig.rollupPreprocessor.plugins,
                    istanbul({
                        exclude: [
                            'tests/**/*.js',
                            'node_modules/**/*.js',
                            'src/scripts/**/*.spec.js'
                        ]
                    })
                ]
            },
            reporters: [
                ...karmaConfig.reporters,
                'coverage'
            ],
            coverageReporter: {
                reporters: [
                    //{type: 'html', dir: 'coverage/'},
                    {type: 'cobertura', dir: 'coverage/'},
                    {type: 'lcovonly', dir: 'coverage/'}
                ]
            }
        };
    } else {
        console.log('Skipping code coverage report...');
    }

    config.set(karmaConfig);
};
