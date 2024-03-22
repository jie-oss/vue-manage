import request from "../utils/request"
export default {
  login(params) {
    return request({
      url: "/users/login",
      method: 'post',
      data: params,
      mock: false
    })
  },
  noticeCount() {
    return request({
      url: '/leave/count',
      method: 'get',
      data: {},
      mock: false
    })
  },
  menuList() {
    return request({
      url: '/menu/list',
      method: 'get',
      data: {},
      mock: false
    })
  },
  userList(params) {
    return request({
      url: '/users/list',
      method: 'get',
      data: params,
      mock: false
    })
  },
  userDelete(params) {
    return request({
      url: '/users/delete',
      method: 'post',
      data: params,
      mock: false
    })
  },
  getRoleList() {
    return request({
      url: '/roles/allList',
      method: 'get',
      data: {},
      mock: false
    })
  },
  getDepList() {
    return request({
      url: '/dept/list',
      method: 'get',
      data: {},
      mock: false
    })
  },
  userSubmit(params) {
    return request({
      url: '/users/operate',
      method: 'post',
      data: params,
      mock: false
    })
  },
  menuSubmit(params) {
    return request({
      url: '/menu/operate',
      method: 'post',
      data: params,
      mock: false
    })
  }
}