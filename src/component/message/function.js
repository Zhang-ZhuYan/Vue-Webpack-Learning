import Vue from 'vue'
import component from './func-message'

const MessageConstructor = Vue.extend(component);
let instances = [];
let seed = 1;

const remove = (instance) => {
    if(!instance) return;
    const index = instances.findIndex(item => instance.id === item.id);
    instances.splice(index,1);
    return index;
}

const changeVerticalOffset = (index,height) => {
    if(index == instances.length) return;
    instances.forEach((item,i) => {
        if(i > index){
            item.verticalOffset = instances[i-1].verticalOffset;
        }
    });
    instances[index].verticalOffset = height;
}


const showMessage = (options) => {
    if(process.env.$isServer) return; //服务端渲染没有dom，如果方法中有设计dom操作，在服务端渲染时会报错

    const {
        autoClose,
        ...rest
    } = options;

    const instance = new MessageConstructor({
        propsData: {...rest},
        data: {
            autoClose: autoClose === undefined ? 3000: this.autoClose,
        }
    });

    const id = `message_div_${seed++}`;
    instance.id = id;
    instance.vm = instance.$mount(); //生成$el对象，但是还未插入到dom中
    document.body.appendChild(instance.vm.$el); //这是一个全局提醒组件，放在body下面

    //计算高度，放在右下角，初始值为0px
    let verticalOffset = 0;
    instances.forEach(item => {
        verticalOffset += item.$el.offsetHeight + 10; //默认多个提示框之间有10px的距离
    })
    instance.verticalOffset = verticalOffset;
    instances.push(instance);

    instance.vm.$on('close', () => {  //监听关闭事件
        instance.vm.visible = false;
    });

    instance.vm.$on('closed', () => {
        const index = remove(instance);
        const height = instance.verticalOffset;
        document.body.removeChild(instance.vm.$el);
        instance.vm.$destroy();
        changeVerticalOffset(index,height);
    })
    return instance.vm;
}

export default showMessage;