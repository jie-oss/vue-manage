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
  menuList(params) {
    return request({
      url: '/menu/list',
      method: 'get',
      data: params,
      mock: false
    })
  },
  permissionList() {
    return request({
      url: '/users/getPremissionList',
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
  userAllList() {
    return request({
      url: '/users/all/list',
      method: 'get',
      data: {},
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
  getRoleList(params) {
    return request({
      url: '/roles/allList',
      method: 'get',
      data: params,
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
  },
  roleList(params) {
    return request({
      url: '/roles/list',
      method: 'get',
      data: params,
      mock: false
    })
  },
  roleOperate(params) {
    return request({
      url: '/roles/operate',
      method: 'post',
      data: params,
      mock: false
    })
  },
  updataPermission(params) {
    return request({
      url: '/roles/update/permission',
      method: 'post',
      data: params,
      mock: false
    })
  },
  deptList(params) {
    return request({
      url: '/dept/list',
      method: 'get',
      data: params,
      mock: false
    })
  },
  deptOperate(params) {
    return request({
      url: '/dept/operate',
      method: 'post',
      data: params,
      mock: false
    })
  },
  // 审批列表
  getApplyList(params) {
    return request({
      url: '/leave/list',
      method: 'get',
      data: params,
      mock: false
    })
  },
  ApplyListOperate(params) {
    return request({
      url: '/leave/operate',
      method: 'post',
      data: params,
      mock: false
    })
  }
}