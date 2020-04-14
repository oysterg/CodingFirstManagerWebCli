import request from '@/utils/request'

export function fetchProblemList(query) {
  return request({
    url: '/problems/list',
    method: 'get',
    params: query
  })
}

export function fetchProblem(id) {
  return request({
    url: '/problems/detail',
    method: 'get',
    params: { id }
  })
}

export function createProblem(data) {
  return request({
    url: '/problems/create',
    method: 'post',
    data
  })
}

export function updateProblem(data) {
  return request({
    url: '/problems/update',
    method: 'put',
    data
  })
}

export function deleteProblem(id) {
  return request({
    url: '/problems/delete',
    method: 'delete',
    params: { id }
  })
}

export function fetchVJProblemList(query) {
  return request({
    url: '/problems/vj/list',
    method: 'get',
    params: query
  })
}
