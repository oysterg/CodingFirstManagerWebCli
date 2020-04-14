import Mock from 'mockjs'

const userList = []
const titleList = []
const count = 100
const tokens = {
  superAdmin: {
    token: 'superAdmin-token'
  },
  generalAdmin: {
    token: 'generalAdmin-token'
  }
}

for (let i = 0; i < count; i++) {
  userList.push(Mock.mock({
    id: '@increment',
    username: '@name',
    nickname: '@name',
    moto: '@ctitle',
    AC: Mock.mock('@natural(1,1000)'),
    ACB: Mock.mock('@natural(1,500)'),
    rating: Mock.mock('@natural(1,1000)'),
    registerTime: Mock.mock('@date("2019-MM-dd hh:mm:ss")'),
    phone: Mock.mock('@natural(1,13255912586)'),
    email: Mock.mock('@natural(1,1119206288)') + '@qq.com'
  }))
}

for (let i = 0; i < count; i++) {
  titleList.push(Mock.mock({
    userID: '',
    username: '',
    titleID: '@increment',
    name: '@title',
    pictureUrl: '',
    obtainTime: Mock.mock('@date("2019-MM-dd hh:mm:ss")'),
    expireTime: '永久'
  }))
}

export default [
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 10000,
          msg: '登录成功！',
          data: [
            'oysterg',
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVW5kZWZpbmVkIiwiaXAiOiIwOjA6MDowOjA6MDowOjEiLCJpc3MiOiJhdXRoMCIsImV4cCI6MTU4NDY2NDI5MiwiaWF0IjoxNTg0NjM1NDkyLCJ1c2VybmFtZSI6ImF4aWFuZ2NvZGluZyJ9.anvILNzlKZs3ozsji7Fj7pt8NyTo28tF_SoEI5_7s0c',
            {
              id: 1,
              username: 'oysterg',
              nickname: '蛤蜊蒸蛋',
              avatarUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586323255037&di=b2e1b9be8c322804b578c8330fd150b7&imgtype=0&src=http%3A%2F%2Fuploads.scratch.mit.edu%2Fprojects%2Fthumbnails%2F122803291.png',
              adjectiveTitle: '摸鱼的',
              articleTitle: '包工头',
              sealUrl: 'https://i.loli.net/2019/11/12/Qn9K6SajmpLXMZt.png',
              roles: 'superAdmin'
            }
          ]
        }
      }

      return {
        code: 10000,
        data: token
      }
    }
  },

  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const token = config.query

      // mock error
      if (!token) {
        return {
          code: 50008,
          message: '登陆失败, 无法获取用户信息'
        }
      }

      return {
        code: 10000,
        data: {
          name: 'oysterg',
          avatarUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586323255037&di=b2e1b9be8c322804b578c8330fd150b7&imgtype=0&src=http%3A%2F%2Fuploads.scratch.mit.edu%2Fprojects%2Fthumbnails%2F122803291.png',
          roles: 'superAdmin'
        }
      }
    }
  },

  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 10000,
        data: 'success'
      }
    }
  },

  {
    url: '/user/list',
    type: 'get',
    response: config => {
      const { usernameOrNickname, page = 1, limit = 20, sort } = config.query
      let mockList = userList.filter(item => {
        if (usernameOrNickname && item.username.indexOf(usernameOrNickname) < 0) return false
        return true
      })
      if (sort === '-id') {
        mockList = mockList.reverse()
      }
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 10000,
        data: {
          list: pageList,
          total: mockList.length
        }
      }
    }
  },

  {
    url: '/user/title',
    type: 'get',
    response: config => {
      const { name, page = 1, limit = 20, sort } = config.query
      let mockList = titleList.filter(item => {
        if (name && item.name.indexOf(name) < 0) return false
        return true
      })
      if (sort === '-id') {
        mockList = mockList.reverse()
      }
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 10000,
        data: {
          list: pageList,
          total: mockList.length
        }
      }
    }
  },

  {
    url: '/user/updateACB',
    type: 'put',
    response: _ => {
      return {
        code: 10000,
        data: '修改成功'
      }
    }
  },

  {
    url: '/user/updatePsw',
    type: 'put',
    response: _ => {
      return {
        code: 10000,
        data: '修改成功'
      }
    }
  },

  {
    url: '/user/removeTitle',
    type: 'delete',
    response: _ => {
      return {
        code: 10000,
        data: '移除成功'
      }
    }
  },

  {
    url: '/user/addTitle',
    type: 'post',
    response: _ => {
      return {
        code: 10000,
        data: '添加成功'
      }
    }
  }
]
