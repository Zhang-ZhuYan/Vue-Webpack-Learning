const ejs = require('ejs')

module.exports = async (cxt, renderer, template) => {
    cxt.headers['Content-Type'] = 'text/html';
    const context = {url: cxt.path};
    try{
        const appString = await renderer.renderToString(context);
        const { title } = context.meta.inject();
        const html = ejs.render(template, {
            appString,
            style: context.renderStyles(),
            scripts: context.renderScripts(),
            title: title.text()
        });
        cxt.body = html;
    }catch (err){
        console.info('render error:' + err);
        throw err;
    }
}