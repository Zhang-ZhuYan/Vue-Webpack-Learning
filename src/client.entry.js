import createApp from './create-app'
import bus from './util/bus'

const { app, router } = createApp();

bus.$on('handleAuth',() => {
    router.push('/login');
})

router.onReady(() => {
    app.$mount('#root')
})