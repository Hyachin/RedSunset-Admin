/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const videoManageRouter = {
  path: '/videoManage',
  component: Layout,
  redirect: '/videoManage/list',
  children: [
    {
      path: 'list',
      component: () => import('@/views/videoManage/list'),
      name: 'VideoManageList',
      meta: { title: '视频管理', icon: 'example', noCache: true }
    },
    {
      path: 'detail',
      hidden: true,
      component: () => import('@/views/videoManage/detail'),
      name: 'VideoManageDetail',
      meta: { title: '活动审核', icon: 'list', noCache: true }
    }
  ],
  meta: {
    roles: ['admin', 'editor']
  }
}

export default videoManageRouter
