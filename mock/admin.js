const tokens = {
  superAdmin: {
    token: 'superAdmin-token'
  },
  generalAdmin: {
    token: 'generalAdmin-token'
  }
}

export default [
  {
    url: '/admin/login',
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
    url: '/admin/info\.*',
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
    url: '/admin/logout',
    type: 'post',
    response: _ => {
      return {
        code: 10000,
        data: 'success'
      }
    }
  }
]
