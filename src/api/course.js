import request from './request'
// 获取列表
export function reqCourseList(params) {
  return request({
    url: '/admin/course/list',
    method: 'get',
    params
  })
}
// 删除课程
export function reqCourseDel(id) {
  return request({
    url: '/course/del',
    method: 'delete',
    data: {
      id
    }
  })
}
// 查看课程详情
export function reqCourseDetail(id) {
  return request({
    url: '/course/detail',
    params: {
      id
    }
  })
}
// 审核
export function reqVideoAuditEdit(params) {
  return request({
    url: '/video/auditEdit',
    params
  })
}
