import request from './request'

export function reqActivityList(params) {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}
