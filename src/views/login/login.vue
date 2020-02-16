<template>
    <div class="login">
        <h2 class="login-header">登录</h2>
        <div class="login-form">
            <div class="form-input">
                <input type="text" id="username" v-model="username" placeholder="用户名">
            </div>
            <div class="form-input">
                <input type="password" id="password" v-model="password" placeholder="密码">
            </div>
            <div class="form-btn">
                <button @click="login">登录</button>
            </div>
        </div>
    </div>
</template>
<script>
import {login} from '../../api'
import {mapActions,mapState} from 'vuex'
export default {
    metaInfo: {
        title: '用户登录'
    },
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        ...mapActions(['reqLogin']),
        login() {
            // const result = await login(this.username,this.password);
            // if(result.success){
            //     this.$router.replace({path:'/app'});
            // }else{
            //     this.$showMessage({
            //         content: result.data.message
            //     });
            // }
            this.reqLogin(
                { 
                    username:this.username,
                    password:this.password
                }
            ).then(() => {
                this.$router.replace({path:'/app'});
            }).catch(err => {
                this.$showMessage({content: err});
            })
        }
    }

}
</script>
<style lang="css" scoped>
.login{
    background: #ffffff;
    border-radius: 5px;
    width: 60%;
    margin: 0 auto;
    padding: 20px 30px;
    min-width: 400px;
}
.login-header{
    text-align: center
}
.login-form{
   width: 50%;
   margin: 0 auto;
}
.form-input{
    margin-bottom: 10px;
}
.form-input > input[type="text"],.form-input > input[type="password"]{
   box-sizing: border-box; /* 宽度设置为100%，input元素会超出父元素，改成border-box解决 */
   width: 100%;
   height: 35px;
   line-height: 35px;
   padding: 0 10px;
}
.form-btn{
    margin-bottom: 20px;
}
.form-btn>button{
    width: 100%;
    height: 35px;
    background: #409eff;
    outline: none;
    border: none;
    color: #ffffff;
}
</style>