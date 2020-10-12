// 这个文件用来处理所有和商品分类相关的操作
// 引入axios
import axios from '@/utils/myaxios.js'

// 获取所有商品分类数据
export const getAllCateList = (type) => {
  return axios({
    url: 'categories',
    params: {
      type
    }
  })
}
