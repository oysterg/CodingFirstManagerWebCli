import Mock from 'mockjs'

const titleList = []
const count = 100
const lifeTime = ['30天', '90天', '365天', '永久']
for (let i = 0; i < count; i++) {
  titleList.push(Mock.mock({
    titleID: '@increment',
    name: '@title',
    pictureUrl: '',
    type: '',
    lifeTime: Mock.Random.pick(lifeTime)
  }))
}

export default [

  {
    url: '/title/list',
    type: 'get',
    response: config => {
      const { name, page, limit, sort } = config.query
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
    url: '/title/create',
    type: 'post',
    response: _ => {
      return {
        code: 10000,
        data: '创建成功'
      }
    }
  },

  {
    url: '/title/update',
    type: 'put',
    response: _ => {
      return {
        code: 10000,
        data: '修改成功'
      }
    }
  },

  {
    url: '/title/delete',
    type: 'delete',
    response: _ => {
      return {
        code: 10000,
        data: '删除成功'
      }
    }
  }
]
