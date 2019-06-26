import axios from 'axios'
import store from '../store'
import router from '../router'

let this_url_info = {}
let this_router_info ='';
// 创建axios实例
const service = axios.create({
  withCredentials:true,
  baseURL: process.env.BASE_API, // api 的 base_url
  // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
  headers: {'Content-Type': 'application/json; charset=UTF-8'},
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    this_url_info = config;
    if (store.getters.token) {
      config.headers['Authorization'] = "Bearer " + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    
    const res = response.data
    return response.data
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
