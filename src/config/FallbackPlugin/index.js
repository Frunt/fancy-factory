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

// This is Webpack plugin, which fallbacks files which does not exist. Bellow is the fallback sequence:
// 1. The file is checked in app/design (later referenced as `custom`) folder
// 2. The file is checked in vendor (later referenced as `core`) folder

const path = require('path');
const fs = require('fs');

class FallbackPlugin {
    constructor(options) {
        this.options = Object.assign(FallbackPlugin.defaultOptions, options);
    }

    // Default plugin entry-point function
    apply(compiler) {
        compiler.resolverFactory.hooks.resolver.for('normal').tap('FallbackPlugin', (resolver) => {
            resolver.hooks.resolve.tapAsync('FallbackPlugin', (request, resolveContext, callback) => {
                // Determine if request is coming from core file
                let pathIsCore = false;
                if (request.path.match(/vendor/)) pathIsCore = true;

                // Determine if request is coming to custom file
                let requestIsCustom = false;
                if (!!!request.request.match(/vendor/)) requestIsCustom = true;

                    // Check if request can be handled
                    if (!request.path || !request.request) return callback();

                    // Construct expected path to resolved file from any theme root
                    const expected = path.relative(
                        (pathIsCore && !requestIsCustom) ? this.options.fallbackRoot : compiler.context,
                        path.resolve(request.path, request.request)
                    );

                    // Function which passes request modifying path
                    const proceed = (from) => {
                        const newRequest = Object.assign({}, request);
                        switch (from) {
                            // From custom to core
                            case 'custom-to-core':
                                newRequest.path = path.resolve(
                                    this.options.fallbackRoot,
                                    path.relative(
                                        compiler.context,
                                        request.path
                                    )
                                );
                                break;

                            // From core to custom
                            case 'core-to-custom':
                                newRequest.path = path.resolve(
                                    compiler.context,
                                    path.relative(
                                        this.options.fallbackRoot,
                                        request.path
                                    )
                                );
                                break;

                        // From core to core
                        case 'core-to-core':
                            newRequest.request = path.relative(
                                request.path,
                                path.resolve(
                                    this.options.fallbackRoot,
                                    path.relative(
                                        compiler.context,
                                        path.resolve(
                                            request.path,
                                            request.request
                                        )
                                    )
                                )
                            );

                            // If string does not start with `/` or `./` then append relative path
                            if (!newRequest.request.match(/^(.\/|\/)/)) newRequest.request = `./${newRequest.request}`;
                            break;
                        }

                        // If requests are not similar modify request (recursion prevention)
                        if (JSON.stringify(request) === JSON.stringify(newRequest)) return callback();
                        resolver.doResolve(resolver.hooks.resolve, newRequest, 'Resolving with fallback!', resolveContext, callback);
                    };

                    const customPath = path.resolve(compiler.context, expected);
                    const customExists = this.fileOrFolderExists(customPath);

                    // If custom exists and initial path is core - replace path, else return as is.
                    if (customExists) {
                        if (pathIsCore) return proceed('core-to-custom');
                        return callback();
                    }

                    const corePath = path.resolve(this.options.fallbackRoot, expected);
                    const coreExists = this.fileOrFolderExists(corePath);

                    // If core exists and initial path is core – return as is, else replace path.
                    if (coreExists) {
                        if (pathIsCore && !requestIsCustom) return callback();
                        if (requestIsCustom) return proceed('core-to-core');
                        return proceed('custom-to-core');
                    }

                    // File does not exist
                    return callback();
                });
            });
    }

    // Function which checks for Folder or JS file
    fileOrFolderExists(path) {
        return fs.existsSync(path) || fs.existsSync(`${path}.js`) || fs.existsSync(`${path}.scss`);
    }
}

FallbackPlugin.defaultOptions = {
    fallbackRoot: ''
};

module.exports = FallbackPlugin;
