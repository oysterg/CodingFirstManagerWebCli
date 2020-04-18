import request from '@/utils/request'

export function fetchChallengeList(query) {
  return request({
    url: '/challenge/list',
    method: 'get',
    params: query
  })
}

export function fetchChallenge(id) {
  return request({
    url: '/challenge/detail',
    method: 'get',
    params: { id }
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

export function fetchChallengeProblems(query) {
  return request({
    url: '/challenge/problem/list',
    method: 'get',
    params: query
  })
}
