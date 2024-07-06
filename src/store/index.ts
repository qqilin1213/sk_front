/*
 * @Author: qqilin1213
 * @Date: 2024-06-14 15:18:40
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-04 15:53:49
 */
import { createPinia } from 'pinia';
import { useTaskStore } from './modules/task';
import { useRoomStore } from './modules/room';
import { usePlayerStore } from './modules/player';
import { useSocketStore } from './modules/socket';


import { App } from "vue";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);


export function setupStore(app: App<Element>) {
  app.use(pinia);
}

export { useTaskStore, useRoomStore,usePlayerStore,useSocketStore};
export default pinia;
