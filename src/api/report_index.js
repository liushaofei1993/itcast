import axios from '@/utils/myaxios.js'

export const getList = () => {
  return axios({
    url: 'reports/type/1'
  })
}
