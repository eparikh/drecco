var webpack = require("webpack");
module.exports = {
    entry: '/Users/agnessharan/Desktop/NYU/HPS - FA20/KnightEscape/assets/js/entry.js',
    output: {
        path: '/Users/agnessharan/Desktop/NYU/HPS - FA20/KnightEscape/assets/js/',
        filename: 'bundle.js'
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jQuery": "jQuery"
      }
};