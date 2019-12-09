/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

/* eslint-disable import/no-extraneous-dependencies */
// Disabled due webpack plugins being dev dependencies

// TODO: merge Webpack config files

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

const { InjectManifest } = require('workbox-webpack-plugin');

const WebmanifestConfig = require('./webmanifest.config');
const BabelConfig = require('./babel.config');

const projectRoot = path.resolve(__dirname, '..', '..');
const publicRoot = path.resolve(projectRoot, 'pub');
const publicPath = '/static/frontend/Wise/fancyfactory/en_US/Magento_Theme/';
const magentoPubRoot = path.resolve(projectRoot, '..', '..', '..', '..', '..', 'pub');

module.exports = {
    resolve: {
        extensions: [
            '.js',
            '.jsx',
            '.scss',
            '*'
        ]
    },

    cache: false,

    stats: {
        warnings: false
    },

    entry: [
        path.resolve(projectRoot, 'src', 'app', 'index.js')
    ],

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: BabelConfig
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer]
                        }
                    },
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: ['src/app/style/abstract/_abstract.scss', 'src/app/style/abstract/_variables.scss']
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
            }
        ]
    },

    output: {
        filename: '[hash:6].bundle.js',
        chunkFilename: '[name].[hash:6].chunk.js',
        path: path.resolve(projectRoot, 'Magento_Theme', 'web'),
        pathinfo: true,
        publicPath
    },

    plugins: [
        new InjectManifest({
            swSrc: path.resolve(magentoPubRoot, 'sw-compiled.js'),
            exclude: [/\.phtml/]
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(projectRoot, 'src', 'public', 'index.production.html'),
            filename: '../templates/root.phtml',
            inject: false,
            hash: true,
            publicPath,
            minify: {
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                minifyCSS: true,
                minifyJS: true
            }
        }),

        new WebpackPwaManifest(WebmanifestConfig(projectRoot)),

        new webpack.DefinePlugin({
            'process.env': {
                ASSETS_URL: JSON.stringify('/pub/assets'),
                API_URL: JSON.stringify(''),
                REBEM_MOD_DELIM: JSON.stringify('_'),
                REBEM_ELEM_DELIM: JSON.stringify('-'),
                MAGENTO_VERSION: JSON.stringify('2.3.2')
            }
        }),

        new webpack.ProvidePlugin({
            __: path.resolve(path.join(__dirname, 'TranslationFunction')),
            React: 'react'
        }),

        new MiniCssExtractPlugin(),

        new OptimizeCssAssetsPlugin(),

        new CopyWebpackPlugin([
            {
                from: path.resolve(projectRoot, 'src', 'public', 'assets'),
                to: path.resolve(magentoPubRoot, 'assets')
            }
        ]),

        new MinifyPlugin({
            removeConsole: true,
            removeDebugger: true
        }, {
            comments: false
        })
    ]
};
