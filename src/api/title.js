import request from '@/utils/request'

export function fetchTitleList(query) {
  return request({
    url: '/title/list',
    method: 'get',
    params: query
  })
}

export function createTitle(data) {
  return request({
    url: '/title/create',
    method: 'post',
    data
  })
}

export function updateTitle(data) {
  return request({
    url: '/title/update',
    method: 'put',
    data
  })
}

export function deleteTitle(id) {
  return request({
    url: '/title/delete',
    method: 'delete',
    params: { id }
  })
}
