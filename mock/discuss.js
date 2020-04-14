
import Mock from 'mockjs'

const honorRankList = []
const count = 100
for (let i = 0; i < count; i++) {
  honorRankList.push(Mock.mock({
    id: '@increment',
    usernameOne: '@name',
    realNameOne: '@cname',
    userNameTwo: 'name',
    realNameTwo: 'cname',
    userNameThree: 'name',
    realNameThree: 'cname'
  }))
}

export default [
  {
    url: '/discuss/list',
    type: 'get',
    response: config => {
      const { realName, contestLevel, awardLevel, page = 1, limit = 20, sort } = config.query
      let mockList = honorRankList.filter(item => {
        if (contestLevel && item.contestLevel !== contestLevel) return false
        if (realNameOrUserName && item.realNameOrUserName.indexOf(realNameOrUserName) < 0) return false
        if (awardLevel && item.awardLevel !== awardLevel) return false
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
