import request from '@/utils/request'

export function fetchContestList(query) {
  return request({
    url: '/contest/list',
    method: 'get',
    params: query
  })
}

export function fetchContest(id) {
  return request({
    url: '/contest/detail',
    method: 'get',
    params: { id }
  })
}

export function createContest(data) {
  return request({
    url: '/contest/create',
    method: 'post',
    data
  })
}
