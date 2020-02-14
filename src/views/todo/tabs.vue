<template>
    <div class="todo-tabs">
        <span>{{ inCompleteLength }}条未完成</span>
        <div>
            <button v-for="item in filterStatus"
                    :key="item.id"
                    @click="toggerFilter(item.value)" :class="filter == item.value?'todo-tabs-active':''"
            >{{ item.text }}</button>
        </div>
        <button class="clear" @click="clearAllCompleted()">删除已完成</button>
    </div>
</template>
<script>
    export default{
        data(){
            return {
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
        props: {
             filter: {
                 type: String,
                 require: true
             },
             todos: {
                 type: Array,
                 default: []
             }
        },
        computed: {
             inCompleteLength(){
                 return this.todos.filter(item => !item.completed).length;
             }
        },
        methods:{
            activedHandler(tab){
                this.tabsActived = tab;
            },
            clearAllCompleted(){
                this.$emit('clearAllCompleted');
            },
            toggerFilter(filter){
                this.$emit('toggerFilter',filter);
            }
        }
    }
</script>
<style lang="css" scoped>
    .todo-tabs{
        display: flex;
        justify-content: space-between;
    }
    button{
        border:none;
        color: #393939;
        background: #ffffff;
    }
    .todo-tabs-active{
        border: none;
        outline: none;
        font-weight: 700;
    }
    button:focus{
        border: none;
        outline: none;
    }
    .clear{
        color: #23c8db;
    }
    .clear:hover{
        cursor: pointer;
        text-decoration: underline;
    }
</style>