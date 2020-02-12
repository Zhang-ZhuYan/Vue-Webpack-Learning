/**
 * Created by zzy on 2020/2/2.
 */
const path = require('path')
const ExtractPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackConfigBase = require('./webpack.config.base')
const vueServerPlugin = require('vue-server-renderer/server-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin'); //引入这行

let definePlugin = [

]

let config = merge(webpackConfigBase,{
    target: 'node',
    mode: 'none',
    entry: path.join(__dirname,'../src/server.entry.js'),
    devtool: '#source-map',
    output: {
        libraryTarget: 'commonjs2',
        filename: 'server-bulid.js',
        path: path.join(__dirname,'../server-build')
    },
    externals: Object.keys(require('../package.json').dependencies),
    resolve: {
        alias: {
            "vue": path.join(__dirname,'../node_modules/vue/dist/vue.esm.js')
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractPlugin.extract({
                    fallback: 'vue-style-loader',
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
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || "'development'"),
                VUE_ENV: "'server'"
            }
        }),
        new vueServerPlugin(),
        new VueLoaderPlugin(),
        new ExtractPlugin('style.[md5:contenthash:hex:8].css')
    ]
});


module.exports = config;