import request from './request'
export function reqUserTotal() {
  return request({
    url: '/analysis/userTotal'
  })
}
export function reqCourseTotal() {
  return request({
    url: '/analysis/courseTotal'
  })
}
export function reqCourseCommentTotal() {
  return request({
    url: '/analysis/courseCommentTotal'
  })
}
export function reqDynamicTotal() {
  return request({
    url: '/analysis/dynamicTotal'
  })
}
export function reqCourseRank() {
  return request({
    url: '/analysis/courseRank'
  })
}
export function reqCourseType() {
  return request({
    url: '/analysis/courseType'
  })
}
