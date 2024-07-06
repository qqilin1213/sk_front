/*
 * @Author: qqilin1213
 * @Date: 2024-06-17 15:10:26
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 12:12:01
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import piniaStore from './store';
import i18n from './i18n';
import VueNativeSock from 'vue-native-websocket-vue3';
import { useSocketStoreWithOut } from "@/store/modules/socket";
import { setupStore } from "@/store";
// 校验缓存是否能用
import { checkIphoneSafari } from '@/utils/localStorageCheck';

import 'uno.css';
import '@/styles/index.less';
import '@/styles/reset.less';
import '@/assets/fonts/fonts.css';
import '@/assets/styles/base.css';
import 'element-plus/dist/index.css';
//自定义的element UI loading样式
import '@/assets/styles/element_loading.less'

// 支持SVG
import 'virtual:svg-icons-register';
import '@arco-design/web-vue/dist/arco.css';
import Idux from '@/config/idux';

//vue3的挂载方式
const app = createApp(App);
// checkIphoneSafari();
setupStore(app);
const piniaSocketStore = useSocketStoreWithOut();

app.use(i18n);
app.use(router);
app.use(piniaStore);
app.use(Idux);
app.mount('#app');

const playerId = '';
app.use(
  VueNativeSock,
  import.meta.env.VITE_WEBSOCKET_URL + playerId,
  {
    // 启用pinia集成 | enable pinia integration
    store: piniaSocketStore,
    // 数据发送/接收使用使用json
    format: "json",
    // 开启手动调用 connect() 连接服务器
    connectManually: true,
    // 开启自动重连
    reconnection: false,
    // 尝试重连的次数
    reconnectionAttempts: 5,
    // 重连间隔时间
    reconnectionDelay: 3000
  }
);

export default app;
