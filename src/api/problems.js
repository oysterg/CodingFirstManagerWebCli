import request from '@/utils/request'

export function fetchProblemList(query) {
  return request({
    url: '/admin/problems/list',
    method: 'get',
    params: query
  })
}

export function fetchTempProblemList(query) {
  return request({
    url: '/problems/temp/list',
    method: 'get',
    params: query
  })
}

export function fetchProblem(problemId) {
  return request({
    url: '/admin/problems/info',
    method: 'get',
    params: { problemId }
  })
}

export function createProblem(data) {
  return request({
    url: '/problems/create',
    method: 'post',
    params: data
  })
}

export function updateProblem(data) {
  return request({
    url: '/admin/problems/update',
    method: 'put',
    params: data
  })
}

export function deleteProblem(id) {
  return request({
    url: '/admin/problems/delete',
    method: 'delete',
    params: { id }
  })
}

export function fetchVJProblemList(query) {
  return request({
    url: '/admin/problems/vj/list',
    method: 'get',
    params: query
  })
}
