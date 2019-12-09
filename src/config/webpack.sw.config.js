/* eslint-disable import/no-extraneous-dependencies */
// Disabled due webpack plugins being dev dependencies

// TODO: merge Webpack config files

const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const BabelConfig = require('./babel.config');
const FallbackPlugin = require('./FallbackPlugin');

const projectRoot = path.resolve(__dirname, '..', '..');
const fallbackRoot = path.resolve(projectRoot, 'vendor');
const magentoPubRoot = path.resolve(projectRoot, '..', '..', '..', '..', '..', 'pub');

module.exports = (_, options) => {
    const outputFilename =
        'sw-compiled.js';

    const additionalOptions = {};

    const additionalPlugins = [
        new MinifyPlugin({
            removeConsole: true,
            removeDebugger: true
        }, {
            comments: false
        })
    ];

    return {
        ...additionalOptions,

        resolve: {
            extensions: [
                '.js',
                '*'
            ]
        },

        cache: false,

        stats: {
            warnings: false
        },

        entry: [
            path.resolve(projectRoot, 'src', 'sw', 'index.js')
        ],

        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: BabelConfig
                        }
                    ]
                }
            ]
        },

        output: {
            filename: outputFilename,
            publicPath: '/',
            pathinfo: true,
            path: magentoPubRoot
        },

        plugins: [
            new FallbackPlugin({
                fallbackRoot
            }),

            ...additionalPlugins
        ]
    };
};
