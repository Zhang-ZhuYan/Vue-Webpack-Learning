import {
    queryAllTodo,
    login,
    loginOut, 
    addTodo,
    updateTodo,
    deleteTodo,
    deleteAllCompleted
} from '../../api/index'
import showMessage from '../../component/message/function'
import bus from '../../util/bus'
const handleError = (err) => {
    if(err.code === 401){
        showMessage({content: '请登录'});
        bus.$emit('handleAuth');
    }else{
        showMessage({content: err.data.message});
    }
}

export default {
    updateCountAsync(store, args){
        setInterval(function () {
            var preValue = store.state.count;
            store.commit('updateCount', preValue+args.count);
        }, args.timer)
    },
    async queryAllTodo(store) {
        const result = await queryAllTodo();  
        if(result.success){
            showMessage({content: '数据加载'});
            store.commit('filterTodos',result.data);  
        }else{
            handleError(result);
        }
        
    },
    async addTodoAction(store,todo){
        const result = await addTodo(todo);
        if(result.success){
            showMessage({content:'多了一条要做的事'});
            store.commit('addTodos',result.data);
        }else{
            handleError(result);
        }
    },
    async updateTodoAction(store,param){
        const result = await updateTodo(param.id,param.todo);
        if(result.success){
            showMessage({content:'更改一条记录'});
            store.commit('updateTodos',result.data);
        }else{
            handleError(result);
        }
    },
    async deleteTodoAction(store,id){
        const result = await deleteTodo(id);
        if(result.success){
            showMessage({content:'删除一条记录'});
            store.commit('deleteTodos',id);
        }else{
            handleError(result);
        }
    },
    async deleteAllAction(store,ids){
        const result = await deleteAllCompleted(ids);
        if(result.success){
            showMessage({content:`删除${ids.length}条已完成记录`});
            store.commit('deleteAllTodos');
        }else{
            handleError(result);
        }
    },
    reqLogin(store, {username,password}){
        return new Promise(async(resolve,reject) => {
            const result = await login(username,password);
            if(result.success){
                store.commit('setUser',result.data);
                showMessage({content:'登录成功'});
                resolve();
            }else{
                reject(result.data.message);
            }
        })
    },
    loginoutAction(store){
        return new Promise(async(resolve,reject) => {
            const result = await loginOut();
            if(result.success){
                store.commit('setUser',{});
                showMessage({content:'退出登录'});
                resolve();
            }else{
                showMessage({content:'登录失败'});
                reject();
            }
        })
    }
}
