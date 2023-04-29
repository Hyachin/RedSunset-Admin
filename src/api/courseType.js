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
// 全部分类
export function reqCourseTypeList3() {
  return request({
    url: '/courseType/list3'
  })
}
// 添加
export function reqCourseTypeAdd(data) {
  return request({
    url: '/courseType/add',
    method: 'post',
    data
  })
}
// 编辑
export function reqCourseTypeEdit(data) {
  return request({
    url: '/courseType/edit',
    method: 'put',
    data
  })
}
// 删除
export function reqCourseTypeDel(data) {
  return request({
    url: '/courseType/del',
    method: 'delete',
    data
  })
}
