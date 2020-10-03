// 这个文件用来封装与axios相关的所有配置
import axios from 'axios'
// 为axios设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器   config可以认为就是请求报文
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么:
  // 通过请求头的方式传递token数据，并且传递时的键必须设置为Authorization
  // console.log(config)
  // 获取本地存储的token数据
  var token = localStorage.getItem('itcast_manage_token')
  // 如果是登录请求就不再向后台发送token令牌了,因为token是undefined
  if (token) {
    // 在请求头中添加 Authorization 字段,提供token令牌
    config.headers.Authorization = token
  }

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default axios
