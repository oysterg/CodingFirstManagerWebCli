import Mock from 'mockjs'

const userList = []
const titleList = []
const count = 100

for (let i = 0; i < count; i++) {
  userList.push(Mock.mock({
    id: '@increment',
    userID: '@increment',
    userName: '@name',
    nickName: '@name',
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
    userName: '',
    titleID: '@increment',
    name: '@title',
    pictureUrl: '',
    obtainTime: Mock.mock('@date("2019-MM-dd hh:mm:ss")'),
    expireTime: '永久'
  }))
}

export default [
  {
    url: '/user/list',
    type: 'get',
    response: config => {
      const { userNameOrNickName, page = 1, limit = 20, sort } = config.query
      let mockList = userList.filter(item => {
        if (userNameOrNickName && item.userName.indexOf(userNameOrNickName) < 0) return false
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
