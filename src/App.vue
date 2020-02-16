<template>
    <div id="app">
        <div class="exit">
            <button @click="loginout" v-show="isAuth">退出登录 {{user}}</button>
        </div>
        <Header></Header>
        <transition name="fade" mode="out-in">
            <router-view />
        </transition>
        <Footer></Footer>
    </div>
</template>
<script>
    import Header from './layout/header.vue'
    import Todo from './views/todo/todo.vue'
    import Footer from './layout/footer.jsx'
    import {mapActions} from 'vuex'
    export default{
        metaInfo: {
            title: 'my todo App'
        },
        data(){
            return {
                user: {}
            }
        },
        components: {
            "Header": Header,
            "Footer": Footer,
            "Todo": Todo
        },
        computed: {
            isAuth(){
                return this.user == {} ? false:true;
            }
        },
        mounted(){
            this.user = this.$store.user;
        },
        methods: {
            ...mapActions(['loginoutAction']),
            show(){
                this.$showMessage({
                    content: '11111'
                })
            },
            loginout(){
                this.loginoutAction().then(() => {
                    this.$router.replace({path:'/login'});
                })
            }
        }
    }
</script>
<style>
.exit{
    position: absolute;
    right: 10px;
    top: 10px;
}
.exit> a {
    cursor: pointer;
}
</style>