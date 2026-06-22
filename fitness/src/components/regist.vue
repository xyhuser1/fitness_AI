<script setup>
import { ref ,watch} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router=useRouter()
const username=ref('')
const password=ref('')
const passerro=ref('')
const cnpassword=ref('')
const span_cnpassword=ref('')
const reg=/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/
 async function regist(){
    //确认密码
    if (cnpassword.value !== password.value) {
        alert("两次密码输入不一致！");
        return;
    }
 if(!username.value||!password.value||!cnpassword.value){
    // 检查是否为空
    alert("请填写完整！")
    return
 }
//  检查密码格式
 if(!reg.test(password.value)){
    alert("密码格式错误无法注册!")
    return
 }
try{//1.向后端发送请求
    const result = await axios.post('http://localhost:8080/api/user/register', {
            username: username.value,
            password: password.value,
            status: 1
        });
        //2.接收后端数据 
        const res=result.data;
        //
        if(res.code==200){alert(res.message || '注册成功！');
            router.push('/login');}
            else{
                alert(res.message)
            }

}
catch(error){
    alert('网络异常，请检查后端是否启动');
        console.error(error);
}
 
}
let flag=false
watch(password,(newpass)=>{
    if(!newpass){
        passerro.value=''
    }
    else if(newpass.length<6){
        passerro.value='❌ 6-10位，包含字母和数字'
    }
    else{
        passerro.value='密码格式正确✅️'
        flag=true
    }
   confirm();
})
function confirm(){
  
    
    // 先判断是不是空
    if (!cnpassword.value) {
        span_cnpassword.value = '';
        return;
    }
    // 再判断是否一致（用 != 而不是 !==）
    if (cnpassword.value != password.value) {
        span_cnpassword.value = '请确认密码！❌️';
    } else {
        span_cnpassword.value = '✅ 密码一致';
    }
}
function back(){
    router.push('/login')
}
</script>
<template>
<button class="back-btn" @click="back">‹ 返回</button>
<div class="login-back" ><h1 style="text-align: center;color:  #ff6b6b;font-size: 50px;"><b>欢迎注册</b></h1>
<div class="window">
    
<!-- 输入框 -->
<div class="input-1">
    账号: <input  class="login_input" type="text" v-model="username"><br>
    密码：<input class="login_input" type="password" v-model="password"><br>
    确认密码：<input @input="confirm" class="login_input" type="password" v-model="cnpassword"><br>
    <span>{{ passerro }}</span><br>
    <span>{{ span_cnpassword }}</span><br>
    
    <button class="bt_css" @click="regist" >注册</button><br>
    <button class="bt_css" @click="back" >返回登录</button>

    
</div>

</div>
</div>
</template>

<style scoped>
.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #ff6b6b;
  cursor: pointer;
  padding: 8px 0;
}
</style>