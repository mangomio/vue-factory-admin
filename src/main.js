import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from './App.vue'
import router from './router'

import '@/styles/common.scss'
import 'lib-flexible/flexible'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import '../mock';
const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn,
})

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);  // 使用已配置的 pinia 实例
app.use(router)

app.mount('#app')
