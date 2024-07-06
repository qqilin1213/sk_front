/*
 * @Author: qqilin1213
 * @Date: 2024-06-17 16:29:24
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 11:27:42
 */
// src/router/customRoutes.ts
import { RouteRecordRaw } from 'vue-router';

export const customRoutes: RouteRecordRaw[] = [
  {
    path: '/create',
    name: 'index',
    meta: {
      title: '创建比赛',
    },
    component: () => import('@/views/create/index.vue'),
  },
  {
    path: '/room/:roomId/player/:playerId',
    name: 'room',
    meta: {
      title: '房间',
    },
    component: () => import('@/views/room/index.vue'),
  },

];
