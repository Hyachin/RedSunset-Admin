import request from './request'
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
export function reqUserList(params) {
  return request({
    url: '/user/list',
    params
  })
}
