<template>
    <div class="todo">
        <tabs :value="filter" @change="handleChangeTab">
            <tab :label="item.text" :index="item.value" v-for="item in filterStatus" :key="item.value"></tab>
        </tabs>
        <input type="text"
               class="todo-input"
               autofocus="autofocus"
               placeholder="接下来要做点什么呢？"
               @keyup.enter="handleAddTodo"
        >
        <hr>
        <todo-item
                v-for="todo in filterTodo"
                :todo="todo"
                @deleteOne="deleteOne"
                :key="todo.id"
                @handleStatus="handleStatus"
        />
        <div :style="filterTodo.length == 0?'height:40px':''">{{ filterTodo.length == 0?'暂无数据':'' }}</div>
        <hr>
        <todo-tabs :filter="filter"
                   :todos="todos"
                   @clearAllCompleted="clearAllCompleted"
        />
    </div>
</template>
<script>
    import { mapState,mapGetters,mapMutations,mapActions } from 'vuex'
    import TodoItem from './item.vue'
    import TodoTabs from './helper.vue'
    let index = 1;
    export default{
        metaInfo: {
            title: 'zzy todo App'
        },
        data(){
            return {
                //todos: [],
                filter: 'all',
                filterStatus: [
                    {
                        text: '完成',
                        value: 'completed'
                     },
                    {
                        text: '未完成',
                        value: 'incomplete'
                    },{
                        text: '全部',
                        value: 'all'
                    }
                ]
            }
        },
        computed: {
            filterTodo(){
                if(this.filter == 'all'){
                    return this.todos;
                }
                var completed = this.filter === 'completed';
                return this.todos.filter(item => completed == item.completed);
            },
            //参数也可以是数组 ...mapState(['count'])
            ...mapState({
                //count1: 'count'
                count1: (state)=>{
                    return state.count + 1;
                },
                todos: 'todos'
            }),
           /*count(){
                return this.$store.state.count;
            },*/
            ...mapGetters({
                fullName1: 'fullName',
                ATextB: 'a/TextB'
            }),
            /*fullName(){
                return this.$store.getters.fullName;
            }*/
            textA(){
                return this.$store.state.a.textA;
            },
            textB(){
                return this.$store.state.b.textB;
            }
        },
        components: {
            "todo-item": TodoItem,
            "todo-tabs": TodoTabs,
        },
        methods: {
            handleAddTodo(e){
                const content = e.target.value.trim();
                this.addTodoAction({
                    content: content,
                    completed: false
                });
                e.target.value='';
            },
            handleStatus(todo){
                const param = {
                    id: todo.id,
                    todo: {
                        completed: !todo.completed
                    }
                }
                this.updateTodoAction(param);
            },
            deleteOne(id){
                this.deleteTodoAction(id);
            },
            clearAllCompleted(){
                const ids = this.todos.reduce((pre,item,index)=>{
                    if(item.completed){
                        pre.push(item.id);
                    }
                    return pre;
                },[]);
                this.deleteAllAction(ids);
            },
            handleChangeTab(index){
                this.filter = index;
            },
            ...mapMutations(['updateCount','a/updateTextA']),
            ...mapActions(['updateCountAsync','a/changeTextA','queryAllTodo','addTodoAction','deleteTodoAction','deleteAllAction','updateTodoAction'])
        },
        mounted(){
            //this.$store.dispatch('updateCountAsync',{count: 5,timer: 5000});
            //this.updateCount(10);
            //this.updateCountAsync({count: 10, timer: 5000});
            this['a/updateTextA']('I am A');
            this['a/changeTextA']('change TextA');
            this['queryAllTodo']();
        }
    }
</script>
<style lang="css" scoped="">
    .todo{
        background: #ffffff;
        border-radius: 5px;
        width: 60%;
        margin: 0 auto;
        padding: 20px 30px;
        min-width: 400px;
    }
    .todo-input{
        font-size: 20px;
        height: 50px;
        width: 100%;
        border: none;
    }
    .todo-input:focus{
        outline: none;
        border:none;
    }
</style>