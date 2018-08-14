const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

var commonConfig = {
    entry: path.resolve(__dirname + '/src/index.js'),
    output: {
        path: path.resolve(__dirname + '/dist/'),
        filename: 'vue-sticky-messages.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: __dirname,
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    externals: {
        'vue': {
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue',
            root: 'Vue'
        },
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

module.exports = [

    // Config 1: For browser environment
    merge(commonConfig, {
        output: {
            path: path.resolve(__dirname + '/dist/'),
            filename: 'vue-sticky-messages.min.js'
        },
    }),

    // Config 2: For Node-based development environments
    merge(commonConfig, {
        output: {
            filename: 'vue-sticky-messages.js',
            libraryTarget: 'umd',

            // These options are useful if the user wants to load the module with AMD
            library: 'vue-sticky-messages',
            umdNamedDefine: true
        }
    })
];