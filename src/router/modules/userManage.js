/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
const userManageRouter = {
  path: '/userManage',
  component: Layout,
  children: [
    {
      path: 'list',
      component: () => import('@/views/userManage'),
      name: 'UserManageList',
      meta: { title: '用户管理', icon: 'user', noCache: true }
    }
  ],
  meta: {
    roles: ['admin', 'editor']
  }
}

export default userManageRouter
