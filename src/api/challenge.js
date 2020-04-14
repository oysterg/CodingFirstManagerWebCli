import request from '@/utils/request'

export function fetchChallengeList(query) {
  return request({
    url: '/challenge/list',
    method: 'get',
    params: query
  })
}

export function createChallenge(data) {
  return request({
    url: '/challenge/create',
    method: 'post',
    data
  })
}

export function updateChallenge(id) {
  return request({
    url: '/challenge/update',
    method: 'put',
    params: { id }
  })
}

export function deleteChallenge(id) {
  return request({
    url: '/challenge/delete',
    method: 'delete',
    params: { id }
  })
}
