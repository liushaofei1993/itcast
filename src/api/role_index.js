// 这个文件用来处理所有和角色相关的操作
// 引入axios
import axios from '@/utils/myaxios.js'

// 获取所有的角色列表数据
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}
