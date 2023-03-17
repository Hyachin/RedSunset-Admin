import request from './request'
// 获取列表
export function reqActivityList(params) {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}
// 获取详情
export function reqActivityInfo(id) {
  return request({
    url: '/activity/detail',
    method: 'get',
    params: {
      id
    }
  })
}
// 提交编辑
export function reqActivityEdit(data) {
  return request({
    url: '/activity/edit',
    method: 'put',
    data
  })
}
// 新增
export function reqActivityAdd(data) {
  return request({
    url: '/activity/add',
    method: 'post',
    data
  })
}
// 删除
export function reqActivityDelete(id) {
  return request({
    url: '/activity/del',
    method: 'delete',
    data: {
      id
    }
  })
}
