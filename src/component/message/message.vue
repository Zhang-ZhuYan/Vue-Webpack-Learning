<template>
    <transition @afterLeave="handleRemove">
        <div
                class="continer"
                :style="style"
                v-show="visible"
                @mouseenter="clearTimer"
                @mouseleave="createTimer"
        >
            <div class="title" v-show="showTitle">
                {{ title }}
            </div>
            <div class="main">
                <span>{{ content }}</span>
            </div>
            <div class="btns">
                <a class="btn" @click="handleClose">×</a>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        name: 'showMessage',
        data(){
            return {
                visible: true
            }
        },
        props: {
            content: {
                require: true,
                type: String
            },
            title: {
                default: '提示信息'
            },
            showTitle: {
                default: false,
                type: Boolean
            }
        },
        methods: {
            handleClose(e){
                e.preventDefault()
                this.$emit('close');
            },
            handleRemove(){
                this.$emit('closed');
            },
            createTimer(){},
            clearTimer(){}
        },
        computed: {
            style(){
                return {};
            }
        }
    }
</script>
<style lang="css" scoped>
    .continer {
        width: 400px;
        background: #ffffff;
        padding: 10px;
        border-radius: 5px;
    }
    .title{
        border-bottom: 1px solid #f9f9f9;
        padding-bottom: 10px;
    }
    .main {
        margin: 20px 0px 0px 0px;
        color: #787e87;
        min-height: 40px;
    }
    .btns{
        position: absolute;
        right: 10px;
        top: 10px;
    }
    .btns > a{
        text-align: center;
        padding: 5px 10px;
        cursor: pointer;
    }
    .btns > a:hover{
        background: #f9f9f9;
    }

    .v-enter-active,
    .v-leave-active {
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
    }
    .v-enter,
    .v-leave-to {
        transform: translateY(50px);
        opacity: 0;
    }

</style>