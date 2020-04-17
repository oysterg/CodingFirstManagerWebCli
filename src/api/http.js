import axios from 'axios'
import { Message, Notification, MessageBox } from 'element-ui'
import Router from '../router/index'

/**
 * add by axiang [2020/4/7] 建议接口采用我们自己写的封装
 * TODO: 暂未调试
 */
// const config = require('../../config/oj.config.json')
const store = require('../store/index')

axios.defaults.baseURL = process.env.VUE_APP_APIURL
axios.defaults.timeout = 15000
axios.interceptors.response.use(
  res => {
    if (res.data.code === 10001) {
      Notification.error({
        title: '资源不存在',
        duration: 5000,
        position: 'top-left',
        offset: 40,
        showClose: false,
        message: '请求的资源不存在'
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
        message: '业务执行失败，系统可能出现了问题，请稍后重试'
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
    if (
      String(error)
        .toLowerCase()
        .indexOf('timeout') !== -1
    ) {
      Message.error('服务器繁忙，请稍后重试！')
    } else if (error.response.status === 404) {
      Message.error('服务器好像挂了，要不等等试试')
    } else if (error.response.status === 500) {
      Message.error('服务器内部错误！错误原因：' + error.response.data.msg)
    } else {
      Message.error(error.response.data.msg)
    }
    return Promise.reject(error)
  }
)

/**
 * add by axiang [20190613] 对axios进行了二次封装
 * 1.将token封装在请求头部中，方便权限验证； 2.方便使用异步
 */
var http = {
  /** get 请求
   * @param  {接口地址} url
   * @param  {请求参数} params
   */
  get(url, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: {
          'token': store.default.getters.getToken
        }
      })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  /** post 请求
   * @param  {接口地址} url
   * @param  {请求参数} params
   */
  post(url, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        // 放在请求体内
        data: params,
        headers: {
          'token': store.default.getters.getToken
        }
      })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  uploadFile(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: data,
        headers: {
          'token': store.default.getters.getToken,
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
export default http
