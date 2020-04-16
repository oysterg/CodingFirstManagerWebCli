<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="reviewQuery.title" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="reviewQuery.contestKind" placeholder="比赛类型" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in contestKindOptions"
          :key="item"
          :value="item"
        />
      </el-select>
      <el-select v-model="reviewQuery.reviewStatus" placeholder="审核状态" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in reviewStatusOptions"
          :key="item"
          :value="item"
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
      :data="reviews"
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
      <el-table-column label="比赛名称" width="490" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="120">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.username }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名时间" w idth="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.registerTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reviewStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.reviewStatus === '还未审核'" size="mini" type="primary" @click="updateReview(row,$index,'审核通过')">
            通过
          </el-button>
          <el-button v-if="row.reviewStatus === '还未审核'" size="mini" type="danger" @click="updateReview(row,$index, '审核失败')">
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="reviewQuery.page" :limit.sync="reviewQuery.limit" @pagination="getReviews" />

  </div>
</template>

<script>
import { fetchContestReviews, updateReview } from '@/api/contest'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination

export default {
  name: 'RegisterReview',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      reviewStatusOptions: ['还未审核', '审核失败', '审核通过'],
      contestKindOptions: ['练习', '积分', '趣味', '正式', '隐藏', '自定义'],
      dialogVisible: false,
      reviews: null,
      total: 0,
      listLoading: true,
      reviewQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        title: undefined,
        reviewStatus: undefined,
        contestKind: undefined
      },
      rules: {
      }
    }
  },
  created() {
    this.getReviews()
  },
  methods: {
    getReviews() {
      this.listLoading = true
      fetchContestReviews(this.reviewQuery).then(response => {
        const res = response.data
        this.reviews = res.data.list
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.reviewQuery.page = 1
      this.getReviews()
    },
    clearFilter() {
      this.reviewQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        title: undefined,
        reviewStatus: undefined,
        contestKind: undefined
      }
      this.getReviews()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, review } = data
      if (prop === 'id') {
        this.sortByID(review)
      }
    },
    sortByID(sort) {
      if (sort === 'ascending') {
        this.reviewQuery.sort = '+id'
      } else {
        this.reviewQuery.sort = '-id'
      }
      this.handleFilter()
    },
    updateReview(row, index, status) {
      row.reviewStatus = status
      updateReview(row).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '审核成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
