const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'

const config = {
    target: "web",
    entry: path.join(__dirname,'src/index.js'),
    output: {
        filename: "bundle.[hash:8].js",
        path: path.join(__dirname,'dist')
    },
    module: {
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },{
                test: /\.jsx$/,
                loader: 'babel-loader'
            },{
                test: /\.(jpg|gif|jpeg|svg|png)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name].[ext]'
                        }
                    }
                ]
            }

        ]

    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev? '"development"':'"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin()
    ]
}

if(isDev){
    config.module.rules.push(
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader'
                }
            ]
        }
    );
    config.devtool = "#cheap-module-eval-source-map";
    config.devServer = {
        port: 8000,
        host: 'localhost',
        overlay: {
            errors: true
        },
        hot: true
    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin(),new webpack.NoEmitOnErrorsPlugin());
}else{
    config.module.rules.push({
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
    })
    config.plugins.push(
        new ExtractPlugin('style.[md5:contenthash:hex:8].css')
    )
    config.output.filename = 'bundle.[chunkhash:8].js'
}

module.exports = config;