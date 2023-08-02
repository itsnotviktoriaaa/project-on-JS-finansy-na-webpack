const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    mode: "development",
    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: "templates", to: "templates" },
                { from: "css", to: "css" },
                { from: "images", to: "images" },
                { from: "fonts", to: "fonts" },
                { from: "node_modules/bootstrap/dist/js/bootstrap.min.js", to: "bootstrap" },
            ],
        }),
    ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};