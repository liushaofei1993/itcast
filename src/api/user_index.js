// 这个文件用来处理所有和用户相关的操作
// 引入axios
import axios from '@/utils/myaxios.js'
// 登录
export const login = (data) => {
  // axios返回一个promise对象
  return axios({
    // 请求路由路径
    url: 'login',
    // 请求方式默认为get
    method: 'post',
    // post方式所传递的数据
    data
  })
}