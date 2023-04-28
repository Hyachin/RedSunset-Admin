/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
const typeManageRouter = {
  path: '/typeManage',
  component: Layout,
  children: [
    {
      path: 'list',
      component: () => import('@/views/typeManage'),
      name: 'TypeManageList',
      meta: { title: '分类管理', icon: 'list', noCache: true }
    }
  ],
  meta: {
    roles: ['admin', 'editor']
  }
}

export default typeManageRouter
