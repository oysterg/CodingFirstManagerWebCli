import Mock from 'mockjs'
import { deepClone } from '../../src/utils/index.js'
import { asyncRoutes, constantRoutes } from './routes.js'

const routes = deepClone([...constantRoutes, ...asyncRoutes])

const roles = [
  {
    key: 'superAdmin',
    name: 'superAdmin',
    description: '超级管理员. 可以查看所有页面进行所有操作.',
    routes: routes
  },
  {
    key: 'generalAdmin',
    name: 'generalAdmin',
    description: '普通管理员. 可以查看除了权限管理的所有页面，不能进行放号操作',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  }
]

export default [
  // mock get all routes form server
  {
    url: '/role/getRoutes',
    type: 'get',
    response: _ => {
      return {
        code: 10000,
        data: routes
      }
    }
  },

  // mock get all roles form server
  {
    url: '/role/getRoles',
    type: 'get',
    response: _ => {
      return {
        code: 10000,
        data: roles
      }
    }
  },

  // add role
  {
    url: '/role/addRole',
    type: 'post',
    response: {
      code: 10000,
      data: {
        key: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update role
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 10000,
      data: {
        status: 'success'
      }
    }
  },

  // delete role
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 10000,
      data: {
        status: 'success'
      }
    }
  }
]
