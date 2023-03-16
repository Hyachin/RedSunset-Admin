/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const activityCenterRouter = {
  path: '/activityCenter',
  component: Layout,
  redirect: '/activityCenter/list',
  children: [
    {
      path: 'list',
      component: () => import('@/views/activityCenter/list'),
      name: 'ActivityCenterList',
      meta: { title: '活动中心', icon: 'guide', noCache: true }
    },
    {
      path: 'edit',
      hidden: true,
      component: () => import('@/views/activityCenter/edit'),
      name: 'ActivityCenterEdit',
      meta: { title: '活动编辑', icon: 'guide', noCache: true }
    }
  ],
  meta: {
    roles: ['admin', 'editor']
    // title: "活动中心",

  }
}

export default activityCenterRouter
