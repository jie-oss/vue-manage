/**
 * 环境配置封装
 */

const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  // 开发
  dev: {
    baseApi: '/api',
    mockApi: 'https://mock.apifox.com/m1/4068509-0-default/api'
  },
  // 测试
  test: {
    baseApi: '/',
    mockApi: ''
  },
  // 生产
  prod: {
    baseApi: '/',
    mockApi: ''
  }
}

export default {
  env,
  mock: false,
  ...EnvConfig[env],
  namespace: 'manage'
}