import Vuex from 'vuex'
import defaultState from './state/default'
import defaultGetters from './getters/default'
import defaultMutations from './mutations/default'
import defaultActions from './actions/default'

const isDev = process.env.NODE_ENV === 'development'
//因为后面会用到服务端渲染，如果每次渲染都使用同一个store会导致内存溢出，所以应该封装一个函数，在函数中返回store对象
export default  () => {
    const store = new Vuex.Store({
        strict: isDev,  //严格模式，一般在开发时开启
        state: defaultState,
        mutations: defaultMutations,
        getters: defaultGetters,
        actions: defaultActions,
        modules: {
            a: {
                namespaced: true,
                state: {
                    textA: 'a',
                },
                mutations:{
                    updateTextA(state,value){
                        state.textA = value;
                    }
                },
                getters:{
                    /*
                      参数：1.当前模块中的state,
                            2.当前模块内部的getters
                            3.根节点下的state
                            4.全局getters
                     */
                    TextB(state, getters, rootState, rootGetters){
                        return rootState.firstName + rootState.b.textB;
                    },
                    textC(state){
                        return 'textC in a';
                    }
                },
                actions: {
                    /*
                     action 中的第一个参数store对象包含下面几个属性
                         dispatch
                         commit
                         getters
                         state
                         rootGetters
                         rootState
                     调用全局的mutation，action，需要传第三个参数{root: true}
                     */
                    changeTextA({dispatch, commit, getters, rootGetters},value){
                        dispatch('anotherChangeTextA',123456670);
                        //dispatch('updateCountAsync',{count: 2, timer: 5000},{root: true});
                        //commit('updateTextA',value); //调用a模块里面的mutation
                        //commit('updateCount',1111,{root: true});
                    },
                    anotherChangeTextA(store,value){
                        store.commit('updateTextA',value);
                    }
                }
            },
            b: {
                state: {
                    textB: 'b',
                },
                mutations:{
                    updateTextB(state,value){
                        state.textB = value;
                    },
                    updateTextA(state,value){
                        state.textA = "11111";
                    }
                }
            }
        }
    });
    if (module.hot) {
        // 使 action 和 mutation 成为可热重载模块
        module.hot.accept(['./state/default', './mutations/default','./getters/default','./actions/default'], () => {
            // 获取更新后的模块
            // 因为 babel 6 的模块编译格式问题，这里需要加上 `.default`
            const newState = require('./state/default').default;
            const newMutations = require('./mutations/default').default;
            const newGetters = require('./getters/default').default;
            const newActions = require('./actions/default').default;
            // 加载新模块
            store.hotUpdate({
                state: newState,
                mutations: newMutations,
                getters: newGetters,
                actions: newActions
            })
        })
    }
    return store;
};

