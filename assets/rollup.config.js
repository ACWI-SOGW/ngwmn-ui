/**
 * Rollup configuration.
 * NOTE: This is a CommonJS module so it can be imported by Karma.
 */
const path = require('path');

const alias = require('@rollup/plugin-alias');
const buble = require('rollup-plugin-buble');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const { uglify } = require('rollup-plugin-uglify');


const ENV = process.env.NODE_ENV || 'development';

module.exports = {
    input: 'src/scripts/index.js',
    plugins: [
        alias({
            entries: {
                ngwmn: path.resolve(__dirname, 'src/scripts')
            },
            customResolver: resolve.nodeResolve({
                extensions: ['.js', '.json']
            })
        }),
        resolve.nodeResolve({
            // use "module" field for ES6 module if possible
            mainFields: ['module']
        }),
        json(),
        commonjs(),
        buble({
            objectAssign: 'Object.assign'
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify(ENV)
        }),
        ENV === 'production' && uglify({
            compress: {
                dead_code: true,
                drop_console: true
            }
        })
    ],
    // The following was added to prevent problems during development,
    // specifically with the 'watch' state not refreshing on a save.
    watch: {
        chokidar: false
    },
    output: {
        name: 'ngwmn_ui',
        file: 'dist/bundle.js',
        format: 'iife',
        sourcemap: ENV !== 'production' ? 'inline' : false
    },
    treeshake: ENV === 'production'
};
