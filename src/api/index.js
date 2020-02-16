import ajax from './ajax'

export const login = (username,password) => ajax('/user/login',{username,password},'POST');

export const queryAllTodo = () => ajax('/api/todos','GET');

export const loginOut = () => ajax('/user/loginout',{},'POST');

export const addTodo = (todo) => ajax('/api/todo',todo,'POST');

export const updateTodo = (id,todo) => ajax(`/api/todo/${id}`,todo,'PUT');

export const deleteTodo = (id) => ajax(`/api/todo/${id}`,{},'DELETE');

export const deleteAllCompleted = (ids) => ajax('/api/delete/all',{ids},'POST')