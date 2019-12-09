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

const path = require('path');

module.exports = (projectRoot) => {
    const pathToFaviconDir = path.resolve(projectRoot, 'src/public/assets/favicon');

    return {
        name: 'Fancy Factory',
        short_name: 'FancyFactory',
        description: 'Fancy Factory Adult Games',
        background_color: '#ffffff',
        lang: 'en-US',
        theme_color: '#000000',
        start_url: '/',
        crossorigin: null,
        ios: {
            'apple-mobile-web-app-title': 'FancyFactory',
            'apple-mobile-web-app-status-bar-style': 'black'
        },
        inject: true,
        orientation: 'portrait',
        display: 'fullscreen',
        icons: [
            {
                src: path.resolve(pathToFaviconDir, 'ff-logo-ios.png'),
                sizes: [120, 152, 167, 180, 1024],
                destination: path.join('icons', 'ios'),
                ios: true
            },
            {
                src: path.resolve(pathToFaviconDir, 'ff-logo-black.png'),
                size: 1024,
                destination: path.join('icons', 'ios'),
                ios: 'startup'
            },
            {
                src: path.resolve(pathToFaviconDir, 'ff-logo-black.png'),
                sizes: [36, 48, 72, 96, 144, 192, 512],
                destination: path.join('icons', 'android')
            }
        ]
    };
};
