<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="orderQuery.userName" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="orderQuery.goodsID" placeholder="商品ID" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in orders"
          :key="item.goodsID"
          :value="item.goodsID"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="orders"
      border
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.orderID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品ID" width="490" align="center">
        <template slot-scope="{row}">
          <span>{{ row.goodsID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="120">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.userName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="ACB" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cost }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" w idth="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status === '待确认'" size="mini" type="primary" @click="updateOrder(row,$index,'待取货')">
            确认
          </el-button>
          <el-button v-if="row.status === '待确认' || row.status === '待取货'" size="mini" type="danger" @click="updateOrder(row,$index, '已取消')">
            退单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="orderQuery.page" :limit.sync="orderQuery.limit" @pagination="getOrders" />

  </div>
</template>

<script>
import { fetchOrderList, updateOrder } from '@/api/order'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination

export default {
  name: 'OrderList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      dialogVisible: false,
      orders: null,
      total: 0,
      listLoading: true,
      orderQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        goodsID: undefined,
        userName: undefined
      },
      rules: {
      }
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    getOrders() {
      this.listLoading = true
      fetchOrderList(this.orderQuery).then(response => {
        const res = response.data
        this.orders = res.data.list
        this.total = res.data.total
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
        sort: '+id',
        goodsID: undefined,
        userName: undefined
      }
      this.getOrders()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.orderQuery.sort = '+id'
      } else {
        this.orderQuery.sort = '-id'
      }
      this.handleFilter()
    },
    updateOrder(row, index, status) {
      row.status = status
      updateOrder(row).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '更新状态成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
