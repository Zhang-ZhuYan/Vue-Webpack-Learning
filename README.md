# 初始化目录结构
1. 创建文件，在当前目录中执行命令 npm init，创建源码目录src
2. 安装依赖
``
安装vue\webpack\vue-loader\css-loader\vue-template-compiler
``
3. 在src中，创建App.vue,index.js
    ```
    index.js
    ----------------------------------------
    import Vue from 'vue'
    import App from './App.vue'
    
    var root = document.createElement('div');
    document.appendChild(root);   //创建挂载点
    
    new Vue({
        render: (h) => h(App)
    }).$mount(root);
    ```

4. 创建webpack的配置文件，webpack.config.js
    ```
    const path = require('path')
    const VueLoaderPlugin = require('vue-loader/lib/plugin')
    
    module.exports = {
        entry: path.join(__dirname,'src/index.js'),
        output: {
            filename: "bundle.js",
            path: path.join(__dirname,'dist')
        },
        module: {
            rules:[
                {
                    test: /.vue$/,
                    loader: 'vue-loader'
                },{
                    test: /\.css$/,  //这边又顺序要求style-loader要写在前面
                    use: ['style-loader','css-loader']
                }
    
            ]
    
        },
        plugins: [
            new VueLoaderPlugin()
        ]
    }
    
    ```
5. 修改package.js中的scripts
    ```
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "webpack --config webpack.config.js"
      }
    ```
# webpack-dev-server
webpack 开发工具
1. 安装webpack-dev-server
2. 修改package.js的scripts添加一个启动项
    ```
     "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "build": "webpack --config webpack.config.js",
            "dev": "webpack-dev-server --config webpack.config.js",
          }
    ```
3. 由于在实际项目中，要区生产环境和开发环境，需要根据启动命令获取区分环境的变量。安装cross-env来实现生产环境和开发环境的区分  
    package.json 修改成
    ```
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "cross-env NODE_ENV=production  webpack --config webpack.config.js",
        "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js",
     }
    ```
4. 两种方式启动项目使用的是同一个webpack配置文件，需要在webpack.config.js中判断是否开发环境
    ```
    //定义一个变量
    const isDev = process.env.NODE_ENV === 'development';
    //如果是开发环境，添加一些有助于开发的配置
    if(isDev){
        config.devServer = {
             prot: 8000, //端口号
             host: '0.0.0.0' //ip ,设置成0.0.0.0可以通过本机ip+端口号访问，方便内网的其他设备电脑访问,前提是本机ip重定向了         
             overlay: {
                 errors: true //将错误信息显示到屏幕上
             }
        }
    
    }
    
    plugins中添加下面插件，在项目的js代码中就可以获取到NODE_ENV,因为NODE_ENV是一个字符串，要加双引号
    new webpack.definePlugin({
        "process.env": {
             NODE_ENV: isDev?'"development"':'production'
        }
    }) 
    ```
5. 项目中没有创建index.html，项目启动后是无法访问的，可以使用html-webpack-plugin
   ```
      const HtmlWebpackPlugin = require('html-webpack-plugin')
      //安装后，在webpack.config.js的plugins中添加
      new HtmlWebpackPlugin()
      
   ```
6. 开启热加载模式
   ```
      //修改webpack.config.js
      config.devServer = {
           prot: 8000, //端口号
           host: '0.0.0.0' //ip ,设置成0.0.0.0可以通过本机ip+端口号访问，方便内网的其他设备电脑访问,前提是本机ip重定向了         
           overlay: {
               errors: true //将错误信息显示到屏幕上
           },
           hot: true, //开启热加载
      }
      //热加载需要添加一个插件,往plugins中push
      config.plugins.push(new webpack.HotModuleReplacementPlugin());
   ```
   
# 处理css的loader和处理jsx的loader
1. postcss可以理解为一个平台，结合一些插件将会更强大。postcss提供一个解析器，它能够将css解析成抽象语法树
   ```
       //postcss和autoprefixer
       //autoprefixer可以自动的给一些样式加上前缀，以兼容多种内核的浏览器
       //新建postcss 的配置文件，postcss.config.js
       
       const autoprefixer = require("autoprefixer")
       
       module.exports = {
           plugins: [
              autoperfixer()
           ]
       }
       
   ```
2. 可以使用babel使jsx语法转换成js
   ```
      //安装 babel-core，安装完成后会提示要安装@babel/core,
      //安装 babel-preset-env,按需转码，根据浏览器和模块的差异转码成不同版本的js
      //安装 babel-plugin-transform-vue-jsx
      //安装 babel-plugin-syntax-jsx
      新建babel配置文件.babelrc,这是一个json格式的文件
      
     {
        "presets": ['env'],
        "plugins": ['transform-vue-jsx']
     }
   ```
   
# css分模块打包
   使用extract-text-webpack-plugin，会将模板中定义的css单独打包成.css文件
   ```
     1.安装 extract-text-webpack-plugin，安装后可能会因为版本过低报错，可以在安装时指定安装比较新的版本
       npm install extract-text-webpack-plugin@next --save-dev
     2.修改webpack.config.js
       * const extractPlugin = require('extract-text-webpack-plugin')
       * 分环境配置css的加载方式
       * 在开发环境下重新配置
         config.module.rules.push({
             test: '/\.css$/',
             use: extractPlugin.extract({
                 fallback: 'style-loader',
                 use: [
                     loader: 'css-loader',
                     {
                         loader: 'postcss-loader',
                         sourceMap: true
                     }
                 ]
             })
         })
       * plugins中添加
         config.plugins.push(
             new extractPlugin('style.[md5:contenthash:hex:8].css') //打包完后将会生成一个以该参数命名的.css
         )
       * 生产环境打包后的名称改掉，和其他环境区分开
         config.output.filename = 'bundle.[chunkhash].js' 
         测试和开发环境中可以使用
         config.output.filement = 'bundle.[hash:8].js' 
       
   ```
# 整理项目目录
新建一个文件夹build用来存放webpack的配置文件，拆分原来的webpack.config.js  
webpack.config.base.js --webpack公共配置部分  
webpack.config.client.js --webpack根据环境配置的部分
```
   *需要安装使用插件webpack-merge，用来合并webpack配置
   webpack.config.base.js
   
   const path = require('path')
   
   const config = {
       target: "web",
       entry: path.join(__dirname,'../src/index.js'),
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
               }, {
                   test: /\.js$/,    //webpack4.2以上版本配置，如果没有加上__dirname会报错
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

```

```
   webpack.config.cilent.js
   
   const path = require('path')
   const VueLoaderPlugin = require('vue-loader/lib/plugin')
   const HtmlWebpackPlugin = require('html-webpack-plugin')
   const ExtractPlugin = require('extract-text-webpack-plugin')
   const merge = require('webpack-merge')
   const webpack = require('webpack')
   const webpackConfigBase = require('./webpack.config.base')
   
   const isDev = process.env.NODE_ENV === 'development'
   let definePlugin = [
       new webpack.DefinePlugin({
           'process.env': {
               NODE_ENV: isDev? '"development"':'"production"'
           }
       }),
       new VueLoaderPlugin(),
       new HtmlWebpackPlugin()
   ]
   const devServer = {
       port: 8000,
       host: 'localhost',
       overlay: {
           errors: true
       },
       hot: true
   }
   
   let config
   if(isDev){
       config = merge(webpackConfigBase,{
          devtool: "#cheap-module-eval-source-map",
          module: {
              rules: [
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
              ]
          },
          devServer,
          plugins: definePlugin.concat([new webpack.HotModuleReplacementPlugin(),new webpack.NoEmitOnErrorsPlugin()])
       });
   }else{
       config = merge(webpackConfigBase,{
           output: {
             filename: 'bundle.[chunkhash:8].js'
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
```

#rimraf 启动项目前删除打包文件
安装rimraf，修改package.json
```
    script: {
        "clear": "rimraf dist",
        "build:client": "coross-env NODE_ENV=production webpack --config build/webpack.config.client.js"
        "build:clear": "npm run clear && npm run build:client"
    }
``` 

    