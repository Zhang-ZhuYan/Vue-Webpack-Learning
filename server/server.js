const koa = require('koa')  //引入koa
const koaBody = require('koa-body'); //处理body中的数据
const koaSession = require('koa-session')
const send = require('koa-send')   //用于处理静态文件
const path = require('path')
const staticRouter = require('./router/static') //定义了请求拦截的路径
const apiRouter = require('./router/api')
const userRouter = require('./router/user')
const createDB = require('./db/db');
const {appID, appKey} = require('../api.config');


const db = createDB(appID, appKey);


const app = new koa();  //新建一个app实例

app.keys = ['vue ssr'];
app.use(koaSession({
    key: 'v-ssr',
    //maxAge: 2*60*60*1000 //单位毫秒
},app))

const isDev = process.env.NODE_ENV === 'development';  //开发环境和生产环境中的服务端渲染有一点不同，所以要定义一个变量来区分环境

//基本中间件，记录请求信息
app.use(async (cxt, next) => {
    try{
        console.info(`require with path ${cxt.path}`);
        await next();
    }catch (err){
        console.info(err);
        cxt.status = 500;
        if(isDev){
            cxt.body = err.message;  //如果是开发环境，直接打印提示到界面上
        }else{
            cxt.body = 'please try again later';
        }
    }
});

app.use(async (cxt, next) => {
    if(cxt.path === '/favicon.ico'){
        await send(cxt, '/favicon.ico', { root: path.join(__dirname, '../') });
    }else{
        await next();
    }
})

app.use(async(cxt,next) => {
    cxt.db = db;
    await next();
})

app.use(koaBody());
app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(staticRouter.routes()).use(staticRouter.allowedMethods());
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

let pageRouter;
if(isDev){
    pageRouter = require('./router/dev-ssr')
}else{
    pageRouter = require('./router/ssr')
}

app.use(pageRouter.routes()).use(pageRouter.allowedMethods());

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || '3333';
app.listen(PORT, HOST, () => {
    console.info(`server is listening on http://${HOST}:${PORT}`);
})