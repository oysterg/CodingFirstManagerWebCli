import Mock from 'mockjs'

const orderList = []
const count = 100
const status = ['待确认', '已取消', '待取货', '已完成']

for (let i = 0; i < count; i++) {
  orderList.push(Mock.mock({
    id: '@increment',
    orderID: '@increment',
    goodsID: '@natural(15,100)',
    number: '@natural(1,6)',
    userName: '@name',
    cost: Mock.mock('@natural(450,4000)'),
    time: Mock.mock('@date("2020-MM-dd hh:mm:ss")'),
    status: Mock.Random.pick(status)
  }))
}

export default [
  {
    url: '/order/list',
    type: 'get',
    response: config => {
      const { userName, goodsID, page = 1, limit = 20, sort } = config.query
      let mockList = orderList.filter(item => {
        if (goodsID && item.goodsID !== goodsID) return false
        if (userName && item.userName.indexOf(userName) < 0) return false
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
    url: '/order/update',
    type: 'put',
    response: _ => {
      return {
        code: 10000,
        data: '修改成功'
      }
    }
  }
]

