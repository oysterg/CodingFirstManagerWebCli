import Mock from 'mockjs'

const tagList = []
const count = 100

for (let i = 0; i < count; i++) {
  tagList.push(Mock.mock({
    id: '@increment',
    tagID: '@increment',
    name: '@ctitle',
    userName: '@name',
    time: Mock.mock('@date("2020-MM-dd hh:mm:ss")')
  }))
}

export default [

  {
    url: '/tags/list',
    type: 'get',
    response: config => {
      const { name, page, limit, sort } = config.query
      console.log(name)
      let mockList = tagList.filter(item => {
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
    url: '/tags/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const tag of tagList) {
        console.log(tag)
        if (tag.problemID === +id) {
          return {
            code: 10000,
            data: tag
          }
        }
      }
    }
  },

  {
    url: '/tags/create',
    type: 'post',
    response: _ => {
      return {
        code: 10000,
        data: '创建成功'
      }
    }
  },

  {
    url: '/tags/update',
    type: 'put',
    response: _ => {
      return {
        code: 10000,
        data: '修改成功'
      }
    }
  },

  {
    url: '/tags/delete',
    type: 'delete',
    response: _ => {
      return {
        code: 10000,
        data: '删除成功'
      }
    }
  }
]

