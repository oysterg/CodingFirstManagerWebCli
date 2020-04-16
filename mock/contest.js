import Mock from 'mockjs'

const contestList = []
const contestReviewList = []
const count = 100
const kind = ['练习', '积分', '趣味', '正式', '隐藏', '自定义']
const permission = ['公开', '密码', '私有', '注册', '正式', '组队']
const status = ['已结束', '未开始', '正在进行']
const revierStatus = ['还未审核', '审核失败', '审核通过']

for (let i = 0; i < count; i++) {
  contestList.push(Mock.mock({
    id: '@increment',
    contestID: '@increment',
    contestKind: Mock.Random.pick(kind),
    title: '@title',
    description: '@paragraph',
    createUser: '@name',
    createTime: Mock.mock('@date("2020-MM-dd hh:mm:ss")'),
    beginTime: Mock.mock('@date("2020-MM-dd hh:mm:ss")'),
    endTime: Mock.mock('@date("2020-MM-dd hh:mm:ss")'),
    permissionType: Mock.Random.pick(permission),
    password: '',
    registerBeginTime: Mock.mock('@date("2020-MM-dd hh:mm:ss")'),
    registerEndTime: Mock.mock('@date("2020-MM-dd hh:mm:ss")'),
    computerRating: '',
    rankType: '',
    problemPutTag: '',
    statusReadOut: '',
    showRegisterOut: '',
    showRegisterList: '',
    showBorderList: '',
    showOtherStatus: '',
    status: Mock.Random.pick(status)
  }))
}

for (let i = 0; i < count; i++) {
  contestReviewList.push(Mock.mock({
    id: '@increment',
    contestID: '@increment',
    contestKind: Mock.Random.pick(kind),
    title: '@ctitle',
    username: '@name',
    nickname: '@name',
    registerTime: Mock.mock('@date("2020-MM-dd hh:mm:ss")'),
    reviewStatus: Mock.Random.pick(revierStatus),
    reviewInfo: '@ctitle',
    reviewTime: Mock.mock('@date("2020-MM-dd hh:mm:ss")')
  }))
}

export default [
  {
    url: '/contest/list',
    type: 'get',
    response: config => {
      const { contestKind, title, permissionType, status, page = 1, limit = 20, sort } = config.query
      let mockList = contestList.filter(item => {
        if (contestKind && item.contestKind !== contestKind) return false
        if (title && item.title.indexOf(title) < 0) return false
        if (status && item.status !== status) return false
        if (permissionType && item.permissionType !== permissionType) return false
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
    url: '/contest/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const contest of contestList) {
        if (contest.contestID === +id) {
          return {
            code: 10000,
            data: contest
          }
        }
      }
    }
  },

  {
    url: '/contest/create',
    type: 'post',
    response: _ => {
      return {
        code: 10000,
        data: '创建成功'
      }
    }
  },

  {
    url: '/contest/review/list',
    type: 'get',
    response: config => {
      const { contestKind, title, reviewStatus, page = 1, limit = 20, sort } = config.query
      let mockList = contestReviewList.filter(item => {
        if (contestKind && item.contestKind !== contestKind) return false
        if (title && item.title.indexOf(title) < 0) return false
        if (reviewStatus && item.reviewStatus !== reviewStatus) return false
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
    url: '/contest/review/update',
    type: 'put',
    response: _ => {
      return {
        code: 10000,
        data: '修改成功'
      }
    }
  }
]

