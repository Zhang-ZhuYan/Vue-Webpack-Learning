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

# 服务端渲染
## 为什么使用服务端渲染
  1. 有利于SEO(搜索引擎优化)，爬虫一般只会抓取源码，不会执行网站的脚本。  
  2. 更利于首屏渲染，首屏的渲染是node发送过来的html字符串，并不依赖于js文件了，这就会使用户更快的看到页面的内容。减少页面白屏等待时间。
## webpack配置
  1. 新增服务端渲染webpack配置文件，主要的插件vue-server-renderer
  ```
  webpack.config.server.js

const path = require('path')
const ExtractPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackConfigBase = require('./webpack.config.base')
const vueServerPlugin = require('vue-server-renderer/server-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin'); //引入这行，没有打包会报错

let definePlugin = [

]

let config = merge(webpackConfigBase,{
    target: 'node', //是在node环境下执行打包的
    mode: 'none',
    entry: path.join(__dirname,'../src/server.entry.js'), //入口文件
    devtool: '#source-map',
    output: {
        libraryTarget: 'commonjs2', //打包后是module.export的方式
        filename: 'server-bulid.js',
        path: path.join(__dirname,'../server-build')//打包文件存放目录
    },
    externals: Object.keys(require('../package.json').dependencies),//webpack打包时会将依赖的插件也一起打包到出口文件，因为服务端渲染是运行在node端，运行时会去node_modules中加载依赖，所以将dependencies的包排除不打包到server-bulid.js
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

  ```
  2. 新建server/server.js，服务端渲染的主要代码，在这里面去实例化一个webpack compiler实例
  ```
  const koa = require('koa')  //引入koa
const send = require('koa-send')   //用于处理静态文件
const path = require('path')
const staticRouter = require('./static') //静态资源的处理

const app = new koa();  //新建一个app实例

const isDev = process.env.NODE_ENV === 'development';  //开发环境和生产环境中的服务端渲染有一点不同，所以要定义一个变量来区分环境

//基本中间件，记录请求信息
app.use(async (ctx, next) => {
    try{
        console.info(`require with path ${ctx.path}`);
        await next();
    }catch (err){
        console.info(err);
        ctx.status = 500;
        if(isDev){
            ctx.body = err.message;  //如果是开发环境，直接打印提示到界面上
        }else{
            ctx.body = 'please try again later';
        }
    }
});

app.use(async (ctx, next) => { //处理请求/favicon.ico报错
    if(ctx.path === '/favicon.ico'){
        await send(ctx, '/favicon.ico', { root: path.join(__dirname, '../') });
    }else{
        await next();
    }
})

//静态资源
app.use(staticRouter.routes()).use(staticRouter.allowedMethods());


let pageRouter;
if(isDev){
    pageRouter = require('./router/dev-ssr')
}else{
    pageRouter = require('./router/ssr')
}

app.use(pageRouter.routes()).use(pageRouter.allowedMethods());

//执行命名时没有指定ip和端口号，就使用默认的设置
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || '3333';
//监听
app.listen(PORT, HOST, () => {
    console.info(`server is listening on http://${HOST}:${PORT}`);
})
  ```
 
 3. koa-router
 根据环境分别新增dev-ssr.js和ssr.js
 ```
const Router = require('koa-router')
const axios = require('axios')
const MemoryFs = require('memory-fs')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const VueServerRenderer = require('vue-server-renderer')
const serverConfig = require('../../build/webpack.config.server')
const ServerRenderer = require('../server-render')

const serverCompiler = webpack(serverConfig); //compiler负责文件监听和启动编译，compiler实例中包含了完整的webpack配置，全局只有一个compiler实例
const mfs = new MemoryFs();  //memory-fs将打包文件保存到内存，提高访问速度，减少代码写入文件的开销
serverCompiler.outputFileSystem = mfs;

let bundle;
//监听文件的变化，启动新的编译
//err：编译过程中的报错信息
serverCompiler.watch({}, (err, status) => {
    if(err) throw err;
    status = status.toJson();
    status.errors.forEach(error => console.log(error));
    status.warnings.forEach(warning => console.warn(warning));

    //获取编译后生成的文件路径，默认文件名为：vue-ssr-server-bundle.json
    const bundlePath = path.join(serverConfig.output.path,'vue-ssr-server-bundle.json');
    //重新读取编译后的文件到内存中，编译后生成的文件时json格式，所以从内存读取出后要转换格式，必须指定编码格式，不然默认为二进制
    bundle = JSON.parse(mfs.readFileSync(bundlePath,'utf-8'));
})

/*
服务端渲染方法
问题：开发时如果代码改变，需要实时去获取新的打包文件
解决方法：
同时开启客户端启动的线程，在客户端代码打包完成后，发送请求去获取manifest
*/
const handleSSR = async (ctx) => {
    if(!bundle){
        ctx.body = 'please wait amount';
        return;
    }
    //读取js代码 
    //在客户端webpack打包，使用vue-server-renderer/client-plugin生成vue-ssr-client-manifest.json
    const clientManifestResp = await axios.get(
        'http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'
    )

    const clientManifest = clientManifestResp.data;

    //读取html模板，使用ejs
    const template = fs.readFileSync(path.join(__dirname, '../server-template.ejs'),'utf-8');

    //inject:false,不使用插件指定的模板
    const renderer = VueServerRenderer.createBundleRenderer(
        bundle,
        {
            inject: false,
            clientManifest
        }
    );

    await ServerRenderer(ctx, renderer, template);
}

const router = new Router();
router.get('*', handleSSR); //默认所有的请求都用handleSSR去处理

module.exports = router;
 ```
 ssr.js
 ```
const VueServerRenderer = require('vue-server-renderer');
const Router = require('koa-router')
const ServerRender = require('../server-render')
const fs = require('fs');
const path = require('path')

//生产环境可以直接取打包之后的manifest，直接从目录中读取
const clientManifest = require('../../public/vue-ssr-client-manifest.json');

const renderer = VueServerRenderer.createBundleRenderer(
    path.join(__dirname,'../../server-build/vue-ssr-server-bundle.json'),
    {
        inject: false,
        clientManifest
    }
)

//获取模板
const template = fs.readFileSync(
    path.join(__dirname,'../server-template.ejs'),
    'utf-8'
)

const router = new Router();
router.get('*', async (ctx)=> {
   await ServerRender(ctx, renderer, template);
})

module.exports = router;

 ```
 4. server-render
 ```
const ejs = require('ejs')

module.exports = async (ctx, renderer, template) => {
    ctx.headers['Content-Type'] = 'text/html';
    const context = {url: ctx.path};
    try{
        const appString = await renderer.renderToString(context);
        const { title } = context.meta.inject();
        const html = ejs.render(template, {
            appString,
            style: context.renderStyles(),
            scripts: context.renderScripts(),
            title: title.text()
        });
        ctx.body = html;
    }catch (err){
        console.info('render error:' + err);
        throw err;
    }
}
 ```
  5. src下新建server.entry.js，打包的入口文件
  ```
import createApp from './create-app'

export default context => {
    return new Promise((resolve, reject)=>{
        const {app, router} = createApp();
        router.push(context.url);

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            if(matchedComponents.length){
                reject(new Error('not component matched'));
            }
            context.meta = app.$meta(); //服务端渲染时，需要手动去更新模板中的title
            resolve(app);
        })
    })
}
```
6. create-app.js
```
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import createStore from './store';
import createRouter from './router'
import ShowMessage from './component/message'
import '../static/assets/style/style.css'


Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Meta);
Vue.use(ShowMessage);

export default () => {
    const router = createRouter();
    const store = createStore();

    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })

    return {app,router,store};
}

```
# nodemon配置
  上面要启动两个线程比较麻烦，可以使用nodemon合并连个线程  
  1. 安装nodemon
  2. nodemon.json
  3. 修改package.json
  ```
    "dev:client": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.client.js",
    "dev:server": "nodemon server/server.js",
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\" ",
  ```
# 自定义组件
## 用方法调用的组件，类似alert()
1. 确定需求，使用方法应为，this.$showMessage({content: '11111'})
2. src/component/message，下新增message.vue
```
<template>
    <transition @afterLeave="handleRemove">
        <div
                class="continer"
                :style="style"
                v-show="visible"
                @mouseenter="clearTimer"
                @mouseleave="createTimer"
        >
            <div class="title" v-show="showTitle">
                {{ title }}
            </div>
            <div class="main">
                <span>{{ content }}</span>
            </div>
            <div class="btns">
                <a class="btn" @click="handleClose">×</a>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        name: 'showMessage',
        data(){
            return {
                visible: true
            }
        },
        props: {
            content: {
                require: true,
                type: String
            },
            title: {
                default: '提示信息'
            },
            showTitle: {
                default: false,
                type: Boolean
            }
        },
        methods: {
            handleClose(e){
                e.preventDefault()
                this.$emit('close');
            },
            handleRemove(){
                this.$emit('closed');
            },
            createTimer(){},
            clearTimer(){}
        },
        computed: {
            style(){
                return {};
            }
        }
    }
</script>
<style lang="css" scoped>
    .continer {
        width: 400px;
        background: #ffffff;
        padding: 10px;
        border-radius: 5px;
    }
    .title{
        border-bottom: 1px solid #f9f9f9;
        padding-bottom: 10px;
    }
    .main {
        margin: 20px 0px 0px 0px;
        color: #787e87;
        min-height: 40px;
    }
    .btns{
        position: absolute;
        right: 10px;
        top: 10px;
    }
    .btns > a{
        text-align: center;
        padding: 5px 10px;
        cursor: pointer;
    }
    .btns > a:hover{
        background: #f9f9f9;
    }

    .v-enter-active,
    .v-leave-active {
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
    }
    .v-enter,
    .v-leave-to {
        transform: translateY(50px);
        opacity: 0;
    }

</style>
```
2. 新增 func-message.js，用于扩展message.vue
3. 新增 function.js，适应Vue.extend()去注册组件
```
import Vue from 'vue'
import component from './func-message'

const MessageConstructor = Vue.extend(component);
let instances = [];
let seed = 1; //多个组件的序号

//如果只用v-show控制组件显示，dom节点还未真正移除
const remove = (instance) => {
    if(!instance) return;
    const index = instances.findIndex(item => instance.id === item.id);
    instances.splice(index,1);
    return index;
}
//关闭一个提示时，要调整其它提示框的位置
const changeVerticalOffset = (index,height) => {
    if(index == instances.length) return;
    instances.forEach((item,i) => {
        if(i > index){
            item.verticalOffset = instances[i-1].verticalOffset;
        }
    });
    instances[index].verticalOffset = height;
}


const showMessage = (options) => {
    if(process.env.$isServer) return; //服务端渲染没有dom，如果方法中有设计dom操作，在服务端渲染时会报错
    //autoClose自动关闭的时间
    const {
        autoClose,
        ...rest
    } = options;

    const instance = new MessageConstructor({
        propsData: {...rest}, //在extend中要使用propsData
        data: {
            autoClose: autoClose === undefined ? 3000: this.autoClose,
        }
    });

    const id = `message_div_${seed++}`;
    instance.id = id;
    instance.vm = instance.$mount(); //生成$el对象，但是还未插入到dom中
    document.body.appendChild(instance.vm.$el); //这是一个全局提醒组件，放在body下面

    //计算高度，放在右下角，初始值为0px
    let verticalOffset = 0;
    instances.forEach(item => {
        verticalOffset += item.$el.offsetHeight + 10; //默认多个提示框之间有10px的距离
    })
    instance.verticalOffset = verticalOffset;
    instances.push(instance);

    //this.emit('close')
    instance.vm.$on('close', () => {  //监听关闭事件
        instance.vm.visible = false;
    });
    
    instance.vm.$on('closed', () => {
        const index = remove(instance);
        const height = instance.verticalOffset;
        document.body.removeChild(instance.vm.$el);
        instance.vm.$destroy();
        changeVerticalOffset(index,height);
    })
    return instance.vm;
}

export default showMessage;
```
4. 在vue中去使用自定义的组件
```
import Message from './message.vue'
import showMessage from './function'

export default (Vue) => {
    Vue.use(Message.name,Message);
    Vue.prototype.$showMessage = showMessage;
}
```

## 自定tabs组件
使用方法  
```
value:指定激活的标签页
index:标签页id，value=index时，该标签页为选中状态
label:标签页的名称，可以用属性的方式传入，也可以使用插槽
<tabs value="1" @change="handleChangeTab">
    <tab label="选项1" index="1">
        <span>选项1的内容</span>
    </tab>
    <tab index="1">
        <span slot="label">选项2</span>
        <span>选项2的内容</span>
    </tab>
</tabs>
```

# 数据接口
使用APICloud