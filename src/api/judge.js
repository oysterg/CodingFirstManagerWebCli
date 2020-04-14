import request from '@/utils/request'

export function fetchJudgeList(query) {
  return request({
    url: '/judge/list',
    method: 'get',
    params: query
  })
}

export function fetchJudge(id) {
  return request({
    url: '/judge/detail',
    method: 'get',
    params: { id }
  })
}

export function updateJudge(data) {
  return request({
    url: '/mall/update',
    method: 'put',
    data
  })
}

