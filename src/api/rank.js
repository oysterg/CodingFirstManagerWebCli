import request from '@/utils/request'

export function fetchHonorRank(query) {
  return request({
    url: '/rank/honor/list',
    method: 'get',
    params: query
  })
}

export function createHonor(data) {
  return request({
    url: '/rank/honor/create',
    method: 'post',
    data
  })
}

export function updateHonor(id) {
  return request({
    url: '/rank/honor/update',
    method: 'put',
    params: { id }
  })
}

export function deleteHonor(id) {
  return request({
    url: '/rank/honor/delete',
    method: 'delete',
    params: { id }
  })
}
