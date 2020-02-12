<template>
    <div class="todo">
        <input type="text"
               class="todo-input"
               autofocus="autofocus"
               placeholder="接下来要做点什么呢？"
               @keyup.enter="addToDo"
        >
        <hr>
        <todo-item
                v-for="todo in filterTodo"
                :todo="todo"
                @deleteOne="deleteOne"
                :key="todo.id"
        />
        <div :style="filterTodo.length == 0?'height:40px':''">{{ filterTodo.length == 0?'暂无数据':'' }}</div>
        <hr>
        <todo-tabs :filter="filter"
                   :todos="todos"
                   @toggerFilter="toggerFilter"
                   @clearAllCompleted="clearAllCompleted"
        />
        <tabs :value="'value1111'">
            <tab :label="'标签1'"></tab>
            <tab :label="'标签2'"></tab>
            <tab :label="'标签3'"></tab>
        </tabs>
    </div>
</template>
<script>
    import { mapState,mapGetters,mapMutations,mapActions } from 'vuex'
    import TodoItem from './item.vue'
    import TodoTabs from './tabs.vue'
    import Tabs from '../../component/tabs/tabs.vue'
    import Tab from '../../component/tabs/tab.vue'
    let index = 1;
    export default{
        metaInfo: {
            title: 'zzy todo App'
        },
        data(){
            return {
                todos: [],
                filter: 'all',
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
                }
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
            "tabs":Tabs,
            "tab": Tab
        },
        methods: {
            addToDo(e){
                this.todos.unshift({
                    id: index++,
                    content: e.target.value,
                    completed: false
                });
                e.target.value='';
            },
            deleteOne(id){
                this.todos.splice(this.todos.findIndex(todo => id===todo.id),1);
            },
            toggerFilter(filter){
                this.filter = filter;
            },
            clearAllCompleted(){
                this.todos = this.todos.filter(item => !item.completed);
            },
            ...mapMutations(['updateCount','a/updateTextA']),
            ...mapActions(['updateCountAsync','a/changeTextA'])
        },
        mounted(){
            //this.$store.dispatch('updateCountAsync',{count: 5,timer: 5000});
            //this.updateCount(10);
            //this.updateCountAsync({count: 10, timer: 5000});
            this['a/updateTextA']('I am A');
            this['a/changeTextA']('change TextA');
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