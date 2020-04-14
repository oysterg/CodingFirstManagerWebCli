import request from '@/utils/request'

export function fetchTagList(query) {
  return request({
    url: '/tags/list',
    method: 'get',
    params: query
  })
}

export function fetchTag(id) {
  return request({
    url: '/tags/detail',
    method: 'get',
    params: { id }
  })
}

export function createTag(data) {
  return request({
    url: '/tags/create',
    method: 'post',
    data
  })
}

export function updateTag(data) {
  return request({
    url: '/tags/update',
    method: 'put',
    data
  })
}

export function deleteTag(id) {
  return request({
    url: '/tags/delete',
    method: 'delete',
    params: { id }
  })
}
