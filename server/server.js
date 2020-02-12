const koa = require('koa')  //引入koa
const send = require('koa-send')   //用于处理静态文件
const path = require('path')
const staticRouter = require('./static')

const app = new koa();  //新建一个app实例

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

app.use(staticRouter.routes()).use(staticRouter.allowedMethods());


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