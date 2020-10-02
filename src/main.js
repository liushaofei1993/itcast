import Vue from 'vue'
import App from './App.vue'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式
import '@/styles/index.less'
// 引入路由对象
import router from '@/router/index.js'

// 添加导航守卫
router.beforeEach((to, from, next) => {
  console.log(to)
  // 获取本地token数据
  var token = localStorage.getItem('itcast_manage_token')
  // 判断是否登陆过或当前跳转页面是否是登录页,是就继续跳转
  if (token || to.path === '/login') {
    next()
  } else {
    // 否则,就路由重定向到登录页
    next({ name: 'login' })
  }
})

// 让Vue使用element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  // 注入路由
  router,
  render: h => h(App)
}).$mount('#app')
