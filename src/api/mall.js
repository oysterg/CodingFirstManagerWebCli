import request from '@/utils/request'

export function fetchGoodsList(query) {
  return request({
    url: '/admin/mall/list',
    method: 'get',
    params: query
  })
}

export function fetchGoods(id) {
  return request({
    url: '/admin/mall/info',
    method: 'get',
    params: { id }
  })
}

export function createGoods(data) {
  return request({
    url: '/admin/mall/create',
    method: 'post',
    params: data
  })
}

export function updateGoods(data) {
  return request({
    url: '/admin/mall/update',
    method: 'put',
    params: data
  })
}

export function deleteGoods(id) {
  return request({
    url: '/admin/mall/delete',
    method: 'delete',
    params: { id }
  })
}
