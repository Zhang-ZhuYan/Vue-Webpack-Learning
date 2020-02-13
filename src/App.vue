<template>
    <div id="app">
        <Header></Header>
        <tabs :value="'value1111'">
            <tab :label="'标签1'" index="1"></tab>
            <tab index="2"><strong slot="label">标签2</strong></tab>
            <tab :label="'标签3'" index="3"></tab>
        </tabs>
        <transition name="fade" mode="out-in">
            <router-view />
        </transition>
        <button @click="show()">click</button>
        <Footer></Footer>
    </div>
</template>
<script>
    import Header from './layout/header.vue'
    import Todo from './views/todo/todo.vue'
    import Footer from './layout/footer.jsx'
    export default{
        metaInfo: {
            title: 'my todo App'
        },
        data(){
            return {

            }
        },
        components: {
            "Header": Header,
            "Footer": Footer,
            "Todo": Todo
        },
        mounted(){

        },
        methods: {
            show(){
                this.$showMessage({
                    content: '11111'
                })
            }
        }
    }
</script>
<style>

</style>