import { createStore } from 'vuex'

import mutations from './mutations.js'
import storage from '../utils/storage'
import actions from './actions.js'

const state = {
  userInfo: {} || storage.getItem('userInfo'), // 获取用户信息
  menuList: [] || storage.getItem('menuList'), // 获取菜单列表
  actionList: [] || storage.getItem('actionList'), // 获取按钮列表
  noticeCount: 0
}

export default createStore({
  state, mutations, actions
})