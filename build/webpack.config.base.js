const path = require('path')

const config = {
    target: "web",
    entry: path.join(__dirname,'../src/client.entry.js'),
    output: {
        filename: "bundle.[hash:8].js",
        path: path.join(__dirname,'../public'),
        publicPath: "http://127.0.0.1:8000/public/"
    },
    module: {
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },{
                test: /\.jsx$/,
                loader: 'babel-loader'
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: __dirname + 'node_modules',
                include: __dirname + 'src',

            },{
                test: /\.(jpg|gif|jpeg|svg|png)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    }
}

module.exports = config;