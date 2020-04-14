<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="goodsQuery.name" placeholder="商品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="goodsQuery.goodsID" placeholder="商品ID" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in goods"
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加商品
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="goods"
      border
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.goodsID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="490" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="handleUpdate(row)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="库存" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ACB" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cost }}</span>
        </template>
      </el-table-column>
      <el-table-column label="限购" w idth="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.buyLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="120" align="center">
        <template slot-scope="{row}">
          <el-image
            style = "width: 100px; height: 100px"
            :src = "row.pictureUrl"
            :fit = "cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.visible == 1?'显示':'隐藏' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="currentRow = row, currentIndex = $index, dialogVisible = true">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="goodsQuery.page" :limit.sync="goodsQuery.limit" @pagination="getGoods" />

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>确定删除该商品？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">否</el-button>
        <el-button type="primary" @click="handleDelete">是</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchGoodsList, deleteGoods } from '@/api/mall'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination

export default {
  name: 'GoodsList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      dialogVisible: false,
      goods: null,
      total: 0,
      listLoading: true,
      goodsQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        goodsID: undefined,
        name: undefined
      },
      rules: {
      }
    }
  },
  created() {
    this.getGoods()
  },
  methods: {
    getGoods() {
      this.listLoading = true
      fetchGoodsList(this.goodsQuery).then(response => {
        const res = response.data
        this.goods = res.data.list
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.goodsQuery.page = 1
      this.getGoods()
    },
    clearFilter() {
      this.goodsQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        goodsID: undefined,
        name: undefined
      }
      this.getGoods()
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
        this.goodsQuery.sort = '+id'
      } else {
        this.goodsQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCreate() {
      this.$router.push({ path: '/mall/AddGoods' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/mall/EditGoods', query: { id: row.goodsID }})
    },
    handleDelete() {
      this.dialogVisible = false
      const row = this.currentRow
      const index = this.currentIndex
      deleteGoods(row.goodsID).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.goods.splice(index, 1)
        }
      })
    },
    goGoodsDetail(row) {
      this.$router.push({ path: '/mall/goodsDetail', query: { id: row.goodsID }})
    }
  }
}
</script>
