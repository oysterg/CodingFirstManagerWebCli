import request from '@/utils/request'

export function fetchDiscussList(query) {
  return request({
    url: '/discuss/list',
    method: 'get',
    params: query
  })
}
