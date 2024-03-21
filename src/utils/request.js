import axios from "axios";
import config from "../config";
import { ElMessage } from 'element-plus'
import router from "../router";
import storage from './storage'

const TOKEN_ERROR = 'Token认证失败请重新登录'
const NETWORK_ERROR = '网络请求异常请稍后重试'

// 创建axios实例 添加默认配置
const service = axios.create({
  baseURL: config.baseURL,
  timeout: 8000
})

// 请求拦截器
service.interceptors.request.use((req) => {
  // 一些公共的请求机制
  const headers = req.headers;
  const { token = "" } = storage.getItem('userInfo') || {};
  if (!headers.Authorization) headers.Authorization = 'Bearer ' + token;
  return req;
})

// 响应拦截器
service.interceptors.response.use((res) => {
  // 一些公共的响应的机制
  const { data, code, msg } = res.data
  if (code === 200) {
    return data
  } else if (code === 5001) {
    ElMessage.error(TOKEN_ERROR)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return Promise.reject(TOKEN_ERROR)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

// 核心的request函数
function request(options) {
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    // 统一一下 属性是data
    options.params = options.data
  }
  if (typeof options.mock !== 'undefined') {
    config.mock = options.mock
  }
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }
  return service(options)
}

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url, data, ...options,
      method: item,
    })
  }
})

export default request

