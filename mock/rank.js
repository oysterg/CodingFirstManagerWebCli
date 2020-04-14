import Mock from 'mockjs'

const honorRankList = []
const count = 100
const contestLevel = ['其他、不显示在奖项列表中', 'ACM省赛', 'ACM/ICPC区域赛', 'EC-Final', '世界总决赛', '全国蓝桥杯大赛', 'ACM全国邀请赛', '全国大学生程序设计竞赛']
const awardLevel = ['无奖项', '顽强拼搏奖', '优秀奖/鼓励奖', '铜奖', '银奖', '金奖', '一等奖', '二等奖', '三等奖']

for (let i = 0; i < count; i++) {
  honorRankList.push(Mock.mock({
    id: '@increment',
    usernameOne: '@name',
    realNameOne: '@cname',
    userNameTwo: '@name',
    realNameTwo: '@cname',
    userNameThree: '@name',
    realNameThree: '@cname',
    rewardDate: Mock.mock('@date("2019-MM-dd hh:mm:ss")'),
    registerTime: Mock.mock('@date("2020-MM-dd hh:mm:ss")'),
    contestLevel: Mock.Random.pick(contestLevel),
    awardLevel: Mock.Random.pick(awardLevel),
    description: '@ctitle'
  }))
}

export default [
  {
    url: '/rank/honor/list',
    type: 'get',
    response: config => {
      const { realName, contestLevel, awardLevel, page = 1, limit = 20, sort } = config.query
      let mockList = honorRankList.filter(item => {
        if (awardLevel && item.awardLevel !== awardLevel) return false
        if (contestLevel && item.contestLevel !== contestLevel) return false
        if (realName && item.realNameOne.indexOf(realName) < 0) return false
        if (realName && item.realNameTwo.indexOf(realName) < 0) return false
        if (realName && item.realNameThree.indexOf(realName) < 0) return false
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
    url: '/rank/honor/create',
    type: 'post',
    response: _ => {
      return {
        code: 10000,
        data: '新增成功'
      }
    }
  },

  {
    url: '/rank/honor/update',
    type: 'put',
    response: _ => {
      return {
        code: 10000,
        data: '修改成功'
      }
    }
  },

  {
    url: '/rank/honor/delete',
    type: 'delete',
    response: _ => {
      return {
        code: 10000,
        data: '删除成功'
      }
    }
  }
]

