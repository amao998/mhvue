import request from '@/utils/request'
const api_name = '/admin/business/busStation'

export default {
  //查询可用的检测站
  getStationByUserName() {
    return request({
      url: `${api_name}/getStationByUserName`,
      method: 'get'
    })
  },

}
