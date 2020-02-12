const Router = require('koa-router')
const send = require('koa-send')

const router = new Router({prefix: '/public'});

router.get('/*', async (cxt) => {
    await send(cxt,cxt.path);
})
module.exports = router;