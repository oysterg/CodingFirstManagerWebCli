import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Router from '../router/index'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // baseUrl: '/dev-api'
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response
    if (res.data.code === 10001) {
      Notification.error({
        title: '资源不存在',
        duration: 5000,
        position: 'top-left',
        offset: 40,
        showClose: false,
        message: '请求的资源不存在'
      })
      Message({
        message: '资源不存在',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (res.data.code === 20001) {
      Notification.error({
        title: '未登录',
        duration: 5000,
        position: 'top-left',
        offset: 40,
        showClose: false,
        message: '您未登录，请登录后查看'
      })
    } else if (res.data.code === 20002) {
      Notification.error({
        title: '权限不足',
        duration: 5000,
        position: 'top-left',
        offset: 40,
        showClose: false,
        message: '权限不足，请联系管理员'
      })
    } else if (res.data.code === 20003) {
      MessageBox.alert('您的认证已过期，可能已在其他地方登录，如果您有疑问，请联系管理员', '认证过期', {
        confirmButtonText: '重新登录',
        type: 'error',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true
      }).then(() => {
        Router.push({
          path: '/Login'
        }).catch(() => { })
        store.default.commit('LOGOUT')
      }).catch(() => {
        // 在路由中添加了相同的路由会报错 Navigating to current location ("/") is not allowed。
        // 开发者建议不处理异常即可
      })
    } else if (res.data.code === 30001) {
      Notification.error({
        title: '业务执行失败',
        duration: 5000,
        position: 'top-left',
        offset: 40,
        showClose: false,
        message: res.data.msg
      })
    } else if (res.data.code === 30002) {
      Notification.error({
        title: '服务端异常',
        duration: 5000,
        position: 'top-left',
        dangerouslyUseHTMLString: true,
        offset: 40,
        showClose: false,
        message: res.data.msg
      })
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
