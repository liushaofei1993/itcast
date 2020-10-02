// 引入vue
import Vue from 'vue'
// 引入vue-router
import VueRouter from 'vue-router'
// 引入登录组件
import Login from '@/views/login.vue'
// 引入首页组件
import Home from '@/views/home.vue'
// 让vue使用vue-router
Vue.use(VueRouter)

// 创建路由对象
var router = new VueRouter({
  // 添加路由配置
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home
    }
  ]
})

// 导出路由对象
export default router
