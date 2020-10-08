// 引入vue
import Vue from 'vue'
// 引入vue-router
import VueRouter from 'vue-router'
// 引入登录组件
import Login from '@/views/login.vue'
// 引入首页组件
import Home from '@/views/home.vue'
// 引入主体内容组件
import Welcome from '@/views/welcome.vue'
// 引入用户列表组件
import Users from '@/views/users/user.vue'
// 引入角色列表组件
import Roles from '@/views/rights/role.vue'
// 引入权限列表组件
import Rights from '@/views/rights/rights.vue'
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
      component: Home,
      // 添加路由重定向
      redirect: { name: 'welcome' },
      // 添加嵌套路由
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'roles',
          path: 'roles',
          component: Roles
        },
        {
          name: 'rights',
          path: 'rights',
          component: Rights
        }
      ]
    }
  ]
})

// 导出路由对象
export default router
