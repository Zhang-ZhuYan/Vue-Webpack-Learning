const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackConfigBase = require('./webpack.config.base')

let definePlugin = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: "'development'"
        }
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin()
]
const devServer = {
    port: 8001,
    host: 'localhost',
    overlay: {
        errors: true
    },
    hot: true
}

let config

config = merge(webpackConfigBase,{
    entry: path.join(__dirname,'../practice/index.js'),
    output: {
        filename: 'bundle.[hash:8].js'
    },
    resolve: {
        alias: {
            "vue": path.join(__dirname,'../node_modules/vue/dist/vue.esm.js')
        }
    },
    devServer,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: definePlugin.concat([new ExtractPlugin('style.[hash:8].css')])
});


module.exports = config;