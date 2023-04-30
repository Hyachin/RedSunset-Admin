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
// 注册
export function reqUserRegister(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
// 编辑用户信息
export function reqUserEdit2(data) {
  return request({
    url: '/user/edit2',
    method: 'post',
    data
  })
}
// 重置密码
export function reqRefreshPassword(data) {
  return request({
    url: '/user/refreshPassword',
    method: 'post',
    data
  })
}
