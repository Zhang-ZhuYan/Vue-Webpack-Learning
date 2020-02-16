export default {
    updateCount(state,count){
        state.count = count;
    },
    filterTodos(state,todo){
        state.todos = todo;
    },
    setUser(state,user){
        //window.localStorage.setItem('user',JSON.parse(user));
        state.user = user;
    },
    addTodos(state,todo){
        state.todos.unshift(todo);
    },
    updateTodos(state,todo){
        state.todos.splice(
            state.todos.findIndex((item => item.id === todo.id)),
            1,
            todo
        )
    },
    deleteTodos(state,id){
        state.todos = state.todos.filter(
            (item) => item.id != id
        )
    },
    deleteAllTodos(state){
        state.todos = state.todos.filter(t => !t.completed)
    }
}
