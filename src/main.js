import Vue from 'vue'
import VueCompositionAPI, { createApp, h } from '@vue/composition-api'

import App from './App.vue'
import router from './router'

Vue.use(VueCompositionAPI)

// 使用 element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 配置局部可使用的高德地图
import AmapVueConfig from '@amap/amap-vue/lib/config'
AmapVueConfig.key = 'ddd292c88aa1bad9c04891a47724f40a'
// AmapVueConfig.key = 'cfa87b97f9be63bbe53fac563524f28b'
// 全局引入高德地图组件
import AmapVue from '@amap/amap-vue'
AmapVue.config.version = '2.0' // 默认2.0，这里可以不修改
AmapVue.config.key = 'ddd292c88aa1bad9c04891a47724f40a'
// AmapVue.config.key = 'cfa87b97f9be63bbe53fac563524f28b'
AmapVue.config.plugins = [
  'AMap.ToolBar',
  'AMap.MoveAnimation',
  // 在此配置你需要预加载的插件，如果不配置，在使用到的时候会自动异步加载
]
Vue.use(AmapVue)

// 配置进度条
import 'nprogress/nprogress.css'

// 注册全局 axios 请求组件
import axios from './utils/requests'
Vue.prototype.$axios = axios

const app = createApp({
  router,
  render: () => h(App),
})

app.mount('#app')
