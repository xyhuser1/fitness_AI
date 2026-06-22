<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
const username=ref('')
const password=ref('')

const router=useRouter()
  function regist_bt(){
router.push('/regist')
}
async function login_bt(){
try{//发送后端请求
 const result = await axios.post('http://localhost:8080/api/user/login', {
            username: username.value,
            password: password.value,
            status: 1
        });
        const res=result.data
        if(res.code==200){
            alert(res.message || '欢迎登录');
            sessionStorage.setItem('token', 'logged_in');
            router.push('/index');
        } else {
            alert(res.message || '登录失败');
        }

}
catch(error){
    alert('网络异常，请检查后端是否启动');
        console.error(error);
}

}


</script>


<template>
<div class="login-back">
<h1 style="text-align: center;color:  #ff6b6b;font-size: 50px;"><b>减脂小助手</b></h1>
<div class="window">
<!-- 输入框 -->
<div class="input-1">
    账号: <input  class="login_input" type="text" v-model="username"><br>
    密码：<input class="login_input" type="password" v-model="password"><br>
    <button class="bt_css" @click="login_bt">登录</button>
    <button class="bt_css" @click="regist_bt" >点击注册</button>
</div>  
</div>
</div>

</template>

<style scoped>
</style>