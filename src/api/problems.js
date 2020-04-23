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

export function deleteProblem(problemId) {
  return request({
    url: '/admin/problems/delete',
    method: 'delete',
    params: { problemId }
  })
}

export function fetchVJProblemList(query) {
  return request({
    url: '/vj/problem/list',
    method: 'post',
    params: query
  })
}

export function fetchVJProblem(query) {
  return request({
    url: '/vj/problem/info',
    method: 'post',
    params: query
  })
}

export function fetchOjs() {
  return request({
    url: '/vj/util/ojs',
    method: 'post'
  })
}
