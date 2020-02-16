const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
const VueClientPlugin = require('vue-server-renderer/client-plugin')
const webpackConfigBase = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'
let definePlugin = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: isDev? '"development"':'"production"'
        }
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
        favicon: './favicon.ico',
        template: path.join(__dirname, 'template.html')
    }),
    new VueClientPlugin()
]
const devServer = {
        port: 8000,
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            index: '/public/index.html'
        },
        hot: true,
        proxy: {
            '/api': 'http://127.0.0.1:3333/',
            '/user': 'http://127.0.0.1:3333/'
        }
}

let config
if(isDev){
    config = merge(webpackConfigBase,{
       devtool: "#cheap-module-eval-source-map",
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
       devServer,
       plugins: definePlugin.concat([
           new webpack.HotModuleReplacementPlugin(),new webpack.NoEmitOnErrorsPlugin(),
           new ExtractPlugin('style.[md5:contenthash:hex:8].css')
       ])
    });
}else{
    config = merge(webpackConfigBase,{
        output: {
          filename: 'bundle.[chunkhash:8].js',
          publicPath: '/public/'
        },
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
        plugins: definePlugin.concat([new ExtractPlugin('style.[md5:contenthash:hex:8].css')])
    });
}

module.exports = config;