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

//服务端渲染方法
const handleSSR = async (cxt) => {
    if(!bundle){
        cxt.body = 'please wait amount';
        return;
    }
    //读取js代码
    const clientManifestResp = await axios.get(
        'http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'
    )

    const clientManifest = clientManifestResp.data;

    //读取html模板
    const template = fs.readFileSync(path.join(__dirname, '../server-template.ejs'),'utf-8');

    //inject:false,不使用插件指定的模板
    const renderer = VueServerRenderer.createBundleRenderer(
        bundle,
        {
            inject: false,
            clientManifest
        }
    );

    await ServerRenderer(cxt, renderer, template);
}

const router = new Router();
router.get('*', handleSSR);

module.exports = router;