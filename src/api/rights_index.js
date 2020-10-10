// 这个文件用来处理所有和权限相关的操作
// 引入axios
import axios from '@/utils/myaxios.js'

// 获取所有权限
export const getAllRightsList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}

// 获取当前登录用户左侧菜单项的权限
export const getRightsLeftMenu = () => {
  return axios({
    url: 'menus'
  })
}
