import Mock from 'mockjs'

const judgeList = []
const count = 100
const result = ['Wrong Answer', 'Accepted', 'Output Limit Exceeded', 'Complication Error', 'Presentation Error']
const language = ['G++', 'Java', 'Python']

for (let i = 0; i < count; i++) {
  judgeList.push(Mock.mock({
    id: '@increment',
    judgeID: '@increment',
    userName: '@name',
    problemID: Mock.mock('@natural(1000,5000)'),
    result: Mock.Random.pick(result),
    language: Mock.Random.pick(language),
    costTime: Mock.mock('@natural(0,1000)') + 'MS',
    costMemory: Mock.mock('@natural(100,10000)') + 'KB',
    codeLength: Mock.mock('@natural(1,1500)'),
    submitTime: Mock.mock('@date("2020-MM-dd hh:mm:ss")')
  }))
}

export default [
  {
    url: '/judge/list',
    type: 'get',
    response: config => {
      const { problemID, userName, result, language, page = 1, limit = 20, sort } = config.query
      let mockList = judgeList.filter(item => {
        if (problemID && item.problemID !== problemID) return false
        if (userName && item.userName.indexOf(userName) < 0) return false
        if (result && item.result !== result) return false
        if (language && item.language !== language) return false
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
    url: '/judge/update',
    type: 'put',
    response: _ => {
      return {
        code: 10000,
        data: '修改成功'
      }
    }
  }
]

