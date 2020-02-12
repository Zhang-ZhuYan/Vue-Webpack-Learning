const VueServerRenderer = require('vue-server-renderer');
const Router = require('koa-router')
const ServerRender = require('../server-render')
const fs = require('fs');
const path = require('path')

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
router.get('*', async (cxt)=> {
   await ServerRender(cxt, renderer, template);
})

module.exports = router;


