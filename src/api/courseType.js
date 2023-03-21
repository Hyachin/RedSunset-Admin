import request from './request'
// 一级分类Tag
export function reqCourseTypeList() {
  return request({
    url: '/courseType/list',
    method: 'get'
  })
}
// 二级分类Tag
export function reqCourseTypeList2(parentId) {
  return request({
    url: '/courseType/list2',
    method: 'get',
    params: {
      parentId
    }
  })
}
