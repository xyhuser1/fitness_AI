import { createRouter, createWebHashHistory } from 'vue-router'
import index from '../components/index.vue' 
import login from '../components/login.vue'
import regist from '../components/regist.vue'
import progress from '../components/progress.vue'
import diet from '../components/diet.vue'
import sport from '../components/sport.vue'
import profile from '../components/profile.vue'
import bmi from '../components/bmi.vue'
const router=createRouter({
history:createWebHashHistory(),
routes:[
    {
        path:'/regist',
        component:regist
    },
    {
path:'/login',
component:login,
meta:{title:"登录页面"}
    },
  {
path:'/index',
component:index,
meta: { requiresAuth: true } 
    },
    {
        path:'/',
    redirect:'/login'
    },
    {
        path:'/progress',
    component: progress,  
     meta: { requiresAuth: true }
    },
     {
        path:'/diet',
    component: diet,  
     meta: { requiresAuth: true }
    },
    {
        path:'/sport',
    component: sport,  
     meta: { requiresAuth: true }
    },
      {
        path:'/profile',
    component: profile,  
     meta: { requiresAuth: true }
    },
    {
        path:'/bmi',
    component: bmi,  
     meta: { requiresAuth: true }
    }


]})
router.beforeEach((to, from, next) => {
    // 如果这个页面需要登录
    if (to.meta.requiresAuth) {
        const token = sessionStorage.getItem('token');
        if (token) {
            next();  // 有 token，放行
        } else {
            next('/login');  // 没 token，跳回登录页
        }
    } else {
        next();  // 不需要登录，直接放行
    }
})


export  default router