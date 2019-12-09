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
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BabelConfig = require('./babel.config');

const projectRoot = path.resolve(__dirname, '..', '..');

const apiUrl = process.env.API_URL ? process.env.API_URL : 'https://fancyfactory.wdg.com.ua';

module.exports = {
    resolve: {
        extensions: [
            '.js',
            '.jsx',
            '.scss',
            '*'
        ]
    },

    mode: 'development',

    devtool: 'source-map',

    stats: {
        warnings: true,
        children: false
    },

    entry: {
        bundle: path.resolve(projectRoot, 'src', 'app', 'index.js'),
    },

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
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '/',
                            hmr: true,
                            reloadAll: false
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: ['src/app/style/abstract/_abstract.scss']
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                    }
                ]
            }
        ]
    },

    devServer: {
        publicPath: '/',
        historyApiFallback: {
            disableDotRule: true
        },
        port: 3003,
        http2: true,
        hot: true
    },

    output: {
        path: path.resolve(__dirname, '/'),
        publicPath: "/"
    },

    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                ASSETS_URL: JSON.stringify('/assets'),
                API_URL: JSON.stringify(apiUrl),
                REBEM_MOD_DELIM: JSON.stringify('_'),
                REBEM_ELEM_DELIM: JSON.stringify('-'),
                MAGENTO_VERSION: JSON.stringify('2.3.2')
            }
        }),

        new webpack.ProvidePlugin({
            __: path.resolve(path.join(__dirname, 'TranslationFunction')),
            React: 'react'
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(projectRoot, 'src', 'public', 'index.development.html'),
            filename: 'index.html',
            publicPath: '/'
        }),

        new MiniCssExtractPlugin({
            filename: 'build.css',
            publicPath: '/',
            chunkFilename: 'build.css'
        }),

        new CopyWebpackPlugin([
            {
                from: path.resolve(projectRoot, 'src', 'public', 'assets'),
                to: './assets'
            }
        ]),
    ]
};
