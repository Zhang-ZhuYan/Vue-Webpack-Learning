const Router = require('koa-router');

const apiRouter = new Router({prefix: '/api'});

const successRequire = (data) => {
    return {
        data: data,
        success: true
    }
}

const validateLogin = async (cxt,next) => {
    console.info(cxt.session.user);
    if(cxt.session.user){
        await next();
    }else{
        cxt.status = 401;
        cxt.body = '请登录'
    }
}

apiRouter.use(validateLogin);   //在每个请求前先执行该函数

//http://0.0.0.0:3333/api/todos
apiRouter.get('/todos', async (cxt) => {
    console.info('获取全部数据');
    const data =  await cxt.db.getAllTodo();
    cxt.body = successRequire(data);
})
.post('/todo', async (cxt) => {
    const data = await cxt.db.addTodo(cxt.request.body);
    cxt.body = successRequire(data);
})
.put('/todo/:id',async (cxt) => {
    console.info("更新：id="+cxt.params.id);
    const data = await cxt.db.updateTodo(cxt.params.id, cxt.request.body);
    cxt.body = successRequire(data);
})
.delete('/todo/:id',async (cxt) => {
    console.info("删除：id="+cxt.params.id);
    const data = await cxt.db.deleteTodo(cxt.params.id);
    cxt.body = successRequire(data);
})
.post('/delete/all',async (cxt) => {
    console.info('删除全部');
    const data = await cxt.db.deleteAll(cxt.request.body.ids);
    cxt.body = successRequire(data);
})
module.exports = apiRouter;