import request from '@/utils/request'

export function fetchGoodsList(query) {
  return request({
    url: '/mall/list',
    method: 'get',
    params: query
  })
}

export function fetchGoods(id) {
  return request({
    url: '/mall/detail',
    method: 'get',
    params: { id }
  })
}

export function createGoods(data) {
  return request({
    url: '/mall/create',
    method: 'post',
    data
  })
}

export function updateGoods(data) {
  return request({
    url: '/mall/update',
    method: 'put',
    data
  })
}

export function deleteGoods(id) {
  return request({
    url: '/mall/delete',
    method: 'delete',
    params: { id }
  })
}
