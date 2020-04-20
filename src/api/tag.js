import request from '@/utils/request'

export function fetchTagList(query) {
  return request({
    url: '/admin/tag/list',
    method: 'get',
    params: query
  })
}

export function fetchTag(id) {
  return request({
    url: '/admin/tag/info',
    method: 'get',
    params: { id }
  })
}

export function createTag(data) {
  return request({
    url: '/admin/tag/create',
    method: 'post',
    params: data
  })
}

export function updateTag(data) {
  return request({
    url: '/admin/tag/update',
    method: 'put',
    params: data
  })
}

export function deleteTag(id) {
  return request({
    url: '/admin/tag/delete',
    method: 'delete',
    params: { id }
  })
}
