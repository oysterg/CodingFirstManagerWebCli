import request from '@/utils/request'

export function fetchOrderList(query) {
  return request({
    url: '/order/list',
    method: 'get',
    params: query
  })
}

export function updateOrder(data) {
  return request({
    url: '/order/update',
    method: 'put',
    data
  })
}
