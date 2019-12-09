const presets = [
    '@babel/preset-env',
    '@babel/preset-react'
];

const plugins = [
    'transform-rebem-jsx',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    [
        'module-resolver', {
            root: './',
            alias: {
                Style: './src/app/style/',
                Component: './src/app/component/',
                Route: './src/app/route/',
                Store: './src/app/store/',
                Util: './src/app/util/',
                Modules: './src/app/modules/',
                Query: './src/app/query/',
                Type: './src/app/type/'
            }
        }
    ],
];

module.exports = {
    presets,
    plugins
};
