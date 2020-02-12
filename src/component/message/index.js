import Message from './message.vue'
import showMessage from './function'

export default (Vue) => {
    Vue.use(Message.name,Message);
    Vue.prototype.$showMessage = showMessage;
}