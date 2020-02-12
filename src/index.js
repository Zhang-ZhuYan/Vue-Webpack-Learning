import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import store from './store';

Vue.use(Vuex);
import '../static/assets/style/style.css'

var root = document.createElement('div');
document.body.appendChild(root);

new Vue({
    render: (h) => h(App),
    store
}).$mount("#root");