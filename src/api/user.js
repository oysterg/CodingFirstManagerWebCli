import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/user/login',
    method: 'post',
    params
  })
}

export function getInfo(params) {
  return request({
    url: '/user/info',
    method: 'post',
    params
  })
}

export function logout(username) {
  return request({
    url: '/user/logout',
    method: 'post',
    params: username
  })
}

export function fetchUserList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function fetchUser(id) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { id }
  })
}

export function fetchUserTitle(query) {
  return request({
    url: '/user/title',
    method: 'get',
    params: query
  })
}

export function updateACB(data) {
  return request({
    url: '/user/updateACB',
    method: 'put',
    data
  })
}

export function updatePsw(data) {
  return request({
    url: '/user/updatePsw',
    method: 'put',
    data
  })
}

export function removeTitle(titleID, userID) {
  return request({
    url: '/user/removeTitle',
    method: 'delete',
    params: { titleID, userID }
  })
}

export function addTitle(titleID, userID) {
  return request({
    url: '/user/addTitle',
    method: 'post',
    params: { titleID, userID }
  })
}
