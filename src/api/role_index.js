// 这个文件用来处理所有和角色相关的操作
// 引入axios
import axios from '@/utils/myaxios.js'

// 获取所有的角色列表数据
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}

// 删除指定角色的指定权限
export const delRightsByRoleId = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 给角色分配权限
export const grantRightsById = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}
