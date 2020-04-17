import Mock from 'mockjs'

const challengeList = []
const challengeProblems = []
const count = 100
const blockType = ['基础', '几何', '图论', '数学', '数据结构', '搜索', '动态规划']

for (let i = 0; i < count; i++) {
  challengeList.push(Mock.mock({
    id: '@increment',
    name: '@name',
    blockType: Mock.Random.pick(blockType),
    description: '@ctitle',
    preUnlockNum: Mock.mock('@natural(1,4)'),
    preUnlockScore: Mock.mock('@natural(3,15)')
  }))
}

for (let i = 0; i < 7; i++) {
  challengeProblems.push(Mock.mock({
    blockID: '@increment',
    problemOrder: '@increment',
    problemID: '@increment',
    title: '@ctitle',
    score: Mock.mock('@natural(1,4)')
  }))
}

export default [
  {
    url: '/challenge/list',
    type: 'get',
    response: config => {
      const { name, page = 1, limit = 20, sort } = config.query
      let mockList = challengeList.filter(item => {
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
    url: '/challenge/detail',
    type: 'get',
    response: _ => {
      return {
        code: 10000,
        data: '新增成功'
      }
    }
  },

  {
    url: '/challenge/create',
    type: 'post',
    response: _ => {
      return {
        code: 10000,
        data: '新增成功'
      }
    }
  },

  {
    url: '/challenge/update',
    type: 'put',
    response: _ => {
      return {
        code: 10000,
        data: '修改成功'
      }
    }
  },

  {
    url: '/challenge/delete',
    type: 'delete',
    response: _ => {
      return {
        code: 10000,
        data: '删除成功'
      }
    }
  },

  {
    url: '/challenge/problem/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20, sort } = config.query
      let mockList = challengeProblems.filter(item => {
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
  }
]

