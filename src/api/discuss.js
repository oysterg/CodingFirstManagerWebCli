import request from '@/utils/request'

export function fetchDiscussList(query) {
  return request({
    url: '/admin/discuss/post/list',
    method: 'get',
    params: query
  })
}

export function fetchDiscussReply(query) {
  return request({
    url: '/admin/discuss/reply/list',
    method: 'get',
    params: query
  })
}

export function deleteDiscussion(id) {
  return request({
    url: '/admin/discuss/post/delete',
    method: 'delete',
    params: { id }
  })
}

export function deleteReply(id) {
  return request({
    url: '/admin/discuss/reply/delete',
    method: 'delete',
    params: { id }
  })
}
