import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/view/index.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/view/test/VideoRecord.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
