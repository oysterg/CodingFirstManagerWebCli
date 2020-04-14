import Mock from 'mockjs'

const challengeList = []
const count = 100
const blockType = ['其他、不显示在奖项列表中', 'ACM省赛', 'ACM/ICPC区域赛', 'EC-Final', '世界总决赛', '全国蓝桥杯大赛', 'ACM全国邀请赛', '全国大学生程序设计竞赛']
for (let i = 0; i < count; i++) {
  challengeList.push(Mock.mock({
    ID: '@increment',
    name: '@name',
    blockType: Mock.Random.pick(blockType),
    description: '@paragraph'
  }))
}

export default [
  {
    url: '/challenge/list',
    type: 'get',
    response: config => {
      const { name, type, page = 1, limit = 20, sort } = config.query
      let mockList = challengeList.filter(item => {
        if (type && item.type !== type) return false
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
  }
]

