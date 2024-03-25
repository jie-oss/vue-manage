import storage from "../utils/storage.js"
import utils from "../utils/utils.js"
import api from "../api"

export default {
  async loadAsyncRoutes({ commit }) {
    let userInfo = storage.getItem('userInfo') || {}
    if (userInfo.token) {
      const { menuList } = await api.permissionList()
      let routes = utils.generateRoute(menuList)
      // Vite 支持使用特殊的 import.meta.glob 函数从文件系统导入多个模块（该方式为异步加载模块形式）
      const modules = import.meta.glob('../views/*.vue')
      routes = routes.map(route => {
        let path = `../views/${route.component}.vue`
        route.component = modules[path]
        commit('AddRoute', route)
      })
    }
  }
}