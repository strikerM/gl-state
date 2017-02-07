/**
 * Created by Florin on 24-Dec-16.
 */

var webpack = require('webpack');
var path = require('path');
var libraryName = 'gl-state';
var outputFile = libraryName + '.js';

module.exports = {

    context: path.join(__dirname, 'src'),
    devtool: 'source-map',
    entry: "./index.js",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    plugins: [
        new webpack.DefinePlugin({
            GL_STATE_DISABLE_VALIDATIONS: 'false'
        })
    ]
};