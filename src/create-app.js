import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import createStore from './store';
import createRouter from './router'
import ShowMessage from './component/message'
import '../static/assets/style/style.css'


Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Meta);
Vue.use(ShowMessage);

export default () => {
    const router = createRouter();
    const store = createStore();

    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })

    return {app,router,store};
}
