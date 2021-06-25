const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        open: true,
        watchContentBase: true,
        inline: true,
        port: 4000,
        watchOptions: {
            poll: true
        },
        before: function (app, server, compiler) {
            console.log('Welcome to development mode!');
        },

    },

});
