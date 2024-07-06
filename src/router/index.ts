import { createRouter, createWebHistory, Router } from "vue-router";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export const routes = [
  {
    path: '/',
    name: 'index',
    meta: {
      title: '首页',
    },
    component: () => import('@/views/index.vue'),
  },
  {
    path: '/create',
    name: 'create',
    meta: {
      title: '创建房间',
    },
    component: () => import('@/views/create/index.vue'),
  },
  {
    path: '/task',
    name: 'task',
    meta: {
      title: '任务列表',
    },
    component: () => import('@/views/task/index.vue'),
  },
  {
    path: '/taskConfig',
    name: 'taskConfig',
    meta: {
      title: '随机任务配置',
    },
    component: () => import('@/views/taskConfig/index.vue'),
  },
  {
    path: '/join',
    name: 'join',
    meta: {
      title: '进入房间',
    },
    component: () => import('@/views/join/index.vue'),
  },
  {
    path: '/room/:roomId/player/:playerId',
    name: 'room',
    meta: {
      title: '房间',
    },
    component: () => import("@/views/room/index.vue"),
  },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach(async (_to, _from, next) => {
  NProgress.start();
  next();
});

router.afterEach((_to) => {
  NProgress.done();
});

export default router;
