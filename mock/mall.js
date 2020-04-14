import Mock from 'mockjs'

const goodsList = []
const count = 100
const visible = ['0', '1']
const buyVerifyLimit = ['所有人均可购买', '现役人员可购买', '校内人员可购买', '协会成员可购买']

for (let i = 0; i < count; i++) {
  goodsList.push(Mock.mock({
    id: '@increment',
    goodsID: '@increment',
    name: '@ctitle',
    cost: Mock.mock('@natural(450,4000)'),
    stock: Mock.mock('@natural(0,100)'),
    buyLimit: Mock.mock('@natural(1,100)'),
    buyVerifyLimit: Mock.Random.pick(buyVerifyLimit),
    visible: Mock.Random.pick(visible),
    pictureUrl: 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=1811145595,3720136528&fm=74&app=80&f=PNG&size=f121,121?sec=1880279984&t=b6c7ce334626ea1248456844729ff688',
    description: '@paragraph'
  }))
}

export default [
  {
    url: '/mall/list',
    type: 'get',
    response: config => {
      const { goodsID, name, page = 1, limit = 20, sort } = config.query
      let mockList = goodsList.filter(item => {
        if (goodsID && item.goodsID !== goodsID) return false
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
    url: '/mall/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const goods of goodsList) {
        if (goods.goodsID === +id) {
          return {
            code: 10000,
            data: goods
          }
        }
      }
    }
  },

  {
    url: '/mall/create',
    type: 'post',
    response: _ => {
      return {
        code: 10000,
        data: '创建成功'
      }
    }
  },

  {
    url: '/mall/update',
    type: 'put',
    response: _ => {
      return {
        code: 10000,
        data: '修改成功'
      }
    }
  },

  {
    url: '/mall/delete',
    type: 'delete',
    response: _ => {
      return {
        code: 10000,
        data: '删除成功'
      }
    }
  }
]

