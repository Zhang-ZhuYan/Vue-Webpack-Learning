const Router = require('koa-router');

const userRouter = new Router({prefix: '/user'});

userRouter.post('/login', (cxt) => {
    const {username,password} = cxt.request.body;
    if(username === 'admin' && password === '123456'){
        cxt.session.user = {
            username: username
        }
        cxt.body = {
            success: true,
            data: {
                username: username
            }
        }
    }else{
        cxt.body = {
            success: false,
            data: {
                message: '用户名或密码不正确'
            }
        }
    }
})
.post('/loginout', (cxt) => {
    cxt.session.user = null;
    cxt.body = {
        success: true,
        message: '退出登录'
    }
});

module.exports = userRouter;