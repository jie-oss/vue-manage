import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import request from './utils/request'
import storage from "./utils/storage";
import api from './api'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(ElementPlus, { size: "small" })
app.use(router)
app.use(store)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api

// 自定义指令
app.directive('has', {
  beforeMount: (el, binding) => {
    let userAction = storage.getItem('actionList')
    let value = binding.value
    let hasPermission = userAction.includes(value)
    if (!hasPermission) {
      el.style.display = 'none'
      setTimeout(() => {
        el.parentNode.removeChild(el)
      })
    }
  }
})

app.mount('#app')