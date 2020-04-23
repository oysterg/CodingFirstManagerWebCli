<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="orderQuery.orderUser" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="orderQuery.goodsId" placeholder="商品ID" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in orders"
          :key="item.goodsId"
          :value="item.goodsId"
        />
      </el-select>
      <el-select v-model="orderQuery.orderStatus" placeholder="订单状态" @change="handleFilter" class="filter-item" style="width: 130px">
        <el-option
          v-for="item in orderStatusOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
      <el-button v-waves class="filter-item" type="warning" @click="checkReturnOrder">
        取消订单申请
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="orders"
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品ID" width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.goodsId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="200" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.orderUser }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="ACB" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realCost }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.orderTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reviewUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="160" align="center">
        <template slot-scope="{row}">
          <el-button :type="statusType(row.orderStatus)" size="mini" plain>{{ row.orderStatus }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button
            v-if="!orderQuery.orderCancel && row.orderStatus === '待确认'"
            type="warning"
            size="mini"
            @click.native="updateOrderStatus(row,$index,1)">
            确认订单
          </el-button>
          <el-button
            v-if="!orderQuery.orderCancel && row.orderStatus === '待发货'"
            type="primary"
            size="mini"
            @click.native="updateOrderStatus(row,$index,2)">
            发货
          </el-button>
          <el-button
            v-if="!orderQuery.orderCancel && row.orderStatus === '待确认' || !orderQuery.orderCancel &&  row.orderStatus === '待发货'"
            type="danger"
            size="mini"
            @click.native="updateOrderStatus(row,$index,-1)">
            取消订单
          </el-button>
          <el-button
            v-if="orderQuery.orderCancel === 1 && row.orderCancel === 1"
            type="warning"
            size="mini"
            @click.native="updateOrderStatus(row,$index,-1), updateOrderCancel(row,$index,0)">
            同意申请
          </el-button>
          <el-button
            v-if="orderQuery.orderCancel === 1 && row.orderCancel === 1"
            type="danger"
            size="mini"
            @click.native="updateOrderCancel(row,$index,0)">
            拒绝申请
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="orderQuery.page" :limit.sync="orderQuery.limit" @pagination="getOrders" />

  </div>
</template>

<script>
import { fetchOrderList, updateOrder } from '@/api/mall'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'OrderList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      orderStatusOptions: [
        { name: '订单取消', value: -1 },
        { name: '待确认', value: 0 },
        { name: '待发货', value: 1 },
        { name: '已发货', value: 2 },
        { name: '订单完成', value: 3 }
      ],
      currentRow: '',
      currentIndex: '',
      dialogVisible: false,
      orders: null,
      total: 0,
      listLoading: true,
      orderQuery: {
        page: 1,
        limit: 20,
        sort: undefined,
        goodsId: undefined,
        orderUser: undefined,
        orderStatus: undefined,
        orderCancel: undefined
      },
      rules: {
      }
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    parseTime,
    getOrders() {
      this.listLoading = true
      fetchOrderList(this.orderQuery).then(response => {
        const res = response.data
        this.orders = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.orderQuery.page = 1
      this.getOrders()
    },
    clearFilter() {
      this.orderQuery = {
        page: 1,
        limit: 20,
        sort: undefined,
        goodsId: undefined,
        orderUser: undefined,
        orderStatus: undefined,
        orderCancel: undefined
      }
      this.getOrders()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.orderQuery.sort = order
        this.handleFilter()
      }
    },
    statusType(orderStatus) {
      let type = ''
      if (orderStatus === '订单取消') {
        type = 'danger'
      } else if (orderStatus === '待确认' || orderStatus === '待发货') {
        type = 'warning'
      } else if (orderStatus === '订单完成') {
        type = 'success'
      } else {
        type = 'primary'
      }
      return type
    },
    checkReturnOrder() {
      this.orderQuery = {
        page: 1,
        limit: 20,
        sort: undefined,
        goodsId: undefined,
        orderUser: undefined,
        orderStatus: undefined,
        orderCancel: 1
      }
      this.handleFilter()
    },
    updateOrderStatus(row, index, orderStatus) {
      const data = {
        id: row.id,
        orderStatus: orderStatus
      }
      updateOrder(data).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        }
        for (let i = 0; i < this.orderStatusOptions.length; i++) {
          if (this.orderStatusOptions[i].value === orderStatus) {
            row.orderStatus = this.orderStatusOptions[i].name
          }
        }
      })
    },
    updateOrderCancel(row, index, orderCancel) {
      const data = {
        id: row.id,
        orderCancel: orderCancel
      }
      updateOrder(data).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        }
        row.orderCancel = orderCancel
        this.orders.splice(index, 1, row)
      })
    }
  }
}
</script>
