import request from '@/utils/request'

export function fetchHonorRank(query) {
  return request({
    url: '/border//honor_rank',
    method: 'get',
    params: query
  })
}

export function createHonor(data) {
  return request({
    url: '/admin/border/create',
    method: 'post',
    data
  })
}

export function updateHonor(data) {
  return request({
    url: '/admin/border/update',
    method: 'put',
    data: data
  })
}

export function deleteHonor(id) {
  return request({
    url: '/admin/border/delete',
    method: 'delete',
    params: { id }
  })
}
