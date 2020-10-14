// 这个文件用来处理所有和商品分类参数相关的操作
// 引入axios
import axios from '@/utils/myaxios.js'

// 获取所有商品分类参数的数据
export const getAllCateParamsList = (id, sel) => {
  return axios({
    url: `categories/${id}/attributes`,
    params: { sel }
  })
}
