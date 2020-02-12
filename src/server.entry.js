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