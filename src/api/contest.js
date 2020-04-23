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
    url: '/contest/info',
    method: 'get',
    params: { id }
  })
}

export function createContest(data) {
  return request({
    url: '/admin/contest/create',
    method: 'post',
    params: data
  })
}

export function fetchContestReviews(query) {
  return request({
    url: '/admin/contest/review/list',
    method: 'get',
    params: query
  })
}

export function updateReview(data) {
  return request({
    url: '/admin/contest/review/update',
    method: 'put',
    params: data
  })
}
