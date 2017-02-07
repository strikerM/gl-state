/**
 * Created by Florin on 31-Dec-16.
 */

var webpack = require('webpack');
var path = require('path');
var libraryName = 'gl-state';
var outputFile = libraryName + '.min.js';

module.exports = {

    context: path.join(__dirname, 'src'),

    entry: './index.js',

    output: {
        path: path.join(__dirname, 'dist'),
        filename: outputFile,
        library: 'GLState',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    plugins: [
        //new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.DefinePlugin({
            GL_STATE_DISABLE_VALIDATIONS: 'true'
        })
    ]
};