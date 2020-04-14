import Mock from 'mockjs'

const problemList = []
const vjProblemList = []
const count = 100
const difficulty = ['简单', '中等', '困难']
const visible = ['隐藏', '显示']
const belongOJ = ['HDU', 'BNUOJ', 'AcDream', 'CF', 'CF_Gym', 'PKU']
const oj = ['SGU', 'FZU', 'UVA', 'HRBUST', 'SCU', '51Nod']

for (let i = 0; i < count; i++) {
  problemList.push(Mock.mock({
    id: '@increment',
    problemID: '@increment',
    title: '@ctitle',
    ratio: Mock.mock('@float(35.55,78.44,2,2)') + '%',
    difficulty: Mock.Random.pick(difficulty),
    belongOJ: Mock.Random.pick(belongOJ),
    visible: Mock.Random.pick(visible),
    mark: Mock.mock('@natural(0,100)'),
    tag: Mock.mock('@natural(0,2000)'),
    totalAc: Mock.mock('@natural(1000,2000)'),
    totalAcUser: Mock.mock('@natural(0,1000)'),
    totalSubmit: Mock.mock('@natural(2000,3000)'),
    totalSubmitUser: Mock.mock('@natural(0,1000)'),
    timeLimit: '1000MS',
    memoryLimit: '128MB',
    intFormat: '%lld',
    spj: '0',
    description: 'Calculate \n' +
      '<i>A + B</i>.\n' +
      '<br>',
    input: 'Each line will contain two integers \n' +
      '<i>A</i> and \n' +
      '<i>B</i>. Process to end of file.\n' +
      '<br>',
    output: 'For each case, output \n' +
      '<i>A + B</i> in one line.\n' +
      '<br>',
    inputCase: '',
    outputCase: '',
    hint: ''
  }))
}

for (let i = 0; i < count; i++) {
  vjProblemList.push(Mock.mock({
    id: '@increment',
    problemID: '@increment',
    OJ: Mock.Random.pick(oj),
    title: '@title',
    source: '@title',
    updateTime: Mock.mock('@date("2020-MM-dd hh:mm:ss")')
  }))
}

export default [
  {
    url: '/problems/list',
    type: 'get',
    response: config => {
      const { title, difficulty, page = 1, limit = 20, sort } = config.query
      let mockList = problemList.filter(item => {
        if (difficulty && item.difficulty !== difficulty) return false
        if (title && item.title.indexOf(title) < 0) return false
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
    url: '/problems/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const problem of problemList) {
        if (problem.problemID === +id) {
          return {
            code: 10000,
            data: problem
          }
        }
      }
    }
  },

  {
    url: '/problems/create',
    type: 'post',
    response: _ => {
      return {
        code: 10000,
        data: '创建成功'
      }
    }
  },

  {
    url: '/problems/update',
    type: 'put',
    response: _ => {
      return {
        code: 10000,
        data: '修改成功'
      }
    }
  },

  {
    url: '/problems/delete',
    type: 'delete',
    response: _ => {
      return {
        code: 10000,
        data: '删除成功'
      }
    }
  },

  {
    url: '/problems/vj/list',
    type: 'get',
    response: config => {
      const { title, OJ, source, problemID, page = 1, limit = 20, sort } = config.query
      let mockList = vjProblemList.filter(item => {
        if (OJ && item.OJ !== OJ) return false
        if (title && item.title.indexOf(title) < 0) return false
        if (source && item.source.indexOf(source) < 0) return false
        if (problemID && item.problemID.indexOf(problemID) < 0) return false
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

