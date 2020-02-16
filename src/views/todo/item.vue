<template>
    <ul class="todo-content">
        <li class="todo-item">
            <div style="display: table">
                <input style="display: table-cell"
                       type="checkbox"
                       :checked="todo.completed"
                       @click="changeStatus"
                />
                <span :class="todo.completed?'todo-item-completed':''">{{ todo.content }}</span>
            </div>
            <a class="todo-item-delete" @click="deleteOne()">✕</a>
        </li>
    </ul>
</template>
<script>
    export default{
        data(){
            return{

            }
        },
        props:{
            todo: {
                type: Object,
                require: true
            }
        },
        methods:{
            deleteOne(){
                this.$emit('deleteOne',this.todo.id);
            },
            changeStatus(){
                this.$emit('handleStatus', this.todo);
            }
        }
    }
</script>
<style lang="css" scoped>
    .todo-content{
        list-style: none;
        padding: 0px 10px;
    }
    .todo-item{
        display: flex;
        justify-content: space-between;
    }
    .todo-item div>span{
        color: #393939;
        line-height: 32px;
        padding-left: 10px;
    }
    .todo-item-delete{
        color: transparent;
    }
    .todo-item:hover > .todo-item-delete{
        color: #393939;
    }
    .todo-item:hover > .todo-item-delete:hover{
        color: #23c8db;
        cursor: pointer;
    }
    .todo-item-completed{
        text-decoration: line-through;
        color: gray!important;
    }
    input[type='checkbox']{
        width: 32px;
        height: 32px;
        background-color: #fff;
        appearance:none;
        border: 2px solid #23c8db;
        border-radius:50%;
        outline: none;
    }
    input[type='checkbox']:checked{
        border: 2px solid #23c8db;
        width: 32px;
        height: 32px;
        background: url("../../../static/assets/images/check.png")no-repeat center;
    }

</style>