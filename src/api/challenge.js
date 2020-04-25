import request from '@/utils/request'

export function fetchChallengeList(query) {
  return request({
    url: '/admin/challenge/list',
    method: 'get',
    params: query
  })
}

export function fetchAllChallenge() {
  return request({
    url: '/admin/challenge/all',
    method: 'get'
  })
}

export function createChallenge(data) {
  return request({
    url: '/admin/challenge/create',
    method: 'post',
    data
  })
}

export function updateChallenge(data) {
  return request({
    url: '/admin/challenge/update',
    method: 'post',
    data
  })
}

export function deleteChallenge(id) {
  return request({
    url: '/admin/challenge/delete',
    method: 'delete',
    params: { id }
  })
}

export function fetchChallengeProblems(query) {
  return request({
    url: '/admin/challenge/problem/list',
    method: 'get',
    params: query
  })
}
