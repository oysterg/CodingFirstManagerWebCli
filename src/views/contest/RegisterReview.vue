<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="reviewQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="reviewQuery.contestKind" placeholder="比赛类型" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in contestKindOptions"
          :key="item.value"
          :value="item.value"
          :label="item.name"
        />
      </el-select>
      <el-select v-model="reviewQuery.reviewStatus" placeholder="审核状态" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in reviewStatusOptions"
          :key="item.value"
          :value="item.value"
          :label="item.name"
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
      <el-table-column label="报名时间" w idth="140" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.registerTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="120" align="center">
        <template slot-scope="{row}">
          <el-button
            :placement="row.reviewStatus !== '还未审核' ? parseTime(row.reviewTime) : '' "
            :type="getReviewType(row.reviewStatus)"
            plain
            size="mini"
          >
            {{ row.reviewStatus }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.reviewStatus === '还未审核'" size="mini" type="primary" @click="handleUpdate(row,$index,1)">
            通过
          </el-button>
          <el-button v-if="row.reviewStatus === '还未审核'" size="mini" type="danger" @click="handleUpdate(row,$index, 2)">
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="reviewQuery.page" :limit.sync="reviewQuery.limit" @pagination="getReviews" />

    <el-dialog title="审核备注" :visible.sync="dialogVisible">
      <el-form ref="reviewInfo" :model="reviewInfoTemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-input v-model="reviewInfoTemp" placeholder="备注信息" style="width: 400px;" prop="reviewInfoTemp" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateReview">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchContestReviews, updateReview } from '@/api/contest'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'RegisterReview',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      reviewStatus: undefined,
      reviewStatusOptions: [
        { name: '还未审核', value: 0 },
        { name: '审核通过', value: 1 },
        { name: '审核失败', value: 2 }
      ],
      contestKindOptions: [
        { name: '练习', value: 0 },
        { name: '积分', value: 1 },
        { name: '趣味', value: 2 },
        { name: '正式', value: 3 },
        { name: '隐藏', value: 4 },
        { name: '自定义', value: 5 }
      ],
      dialogVisible: false,
      reviews: null,
      total: 0,
      listLoading: true,
      reviewQuery: {
        page: 1,
        limit: 20,
        sort: undefined,
        username: undefined,
        reviewStatus: undefined,
        contestKind: undefined
      },
      reviewInfoTemp: '',
      rules: {
        reviewInfoTemp: [
          { required: true, message: '标签名不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getReviews()
  },
  methods: {
    parseTime,
    getReviews() {
      this.listLoading = true
      fetchContestReviews(this.reviewQuery).then(response => {
        const res = response.data
        this.reviews = res.datas[0]
        this.total = res.datas[0]
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
        sort: undefined,
        username: undefined,
        reviewStatus: undefined,
        contestKind: undefined
      }
      this.getReviews()
    },
    resetTemp() {
      this.reviewInfoTemp = ''
    },
    getReviewStatus(reviewStatus) {
      for (let i = 0; i < this.reviewStatusOptions.length; i++) {
        if (reviewStatus === this.reviewStatusOptions[i].value) {
          return this.reviewStatusOptions[i].name
        }
      }
    },
    getReviewType(reviewStatus) {
      if (reviewStatus === '还未审核') {
        return 'warning'
      } else if (reviewStatus === '审核通过') {
        return 'success'
      } else {
        return 'danger'
      }
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.contestsQuery.sort = order
        this.handleFilter()
      }
    },
    handleUpdate(row, index, status) {
      this.currentRow = row
      this.currentIndex = index
      this.reviewStatus = status
      this.dialogVisible = true
      this.resetTemp()
    },
    updateReview() {
      this.dialogVisible = false
      const data = {
        id: this.currentRow.id,
        reviewInfo: this.reviewInfoTemp,
        reviewStatus: this.reviewStatus
      }
      this.$refs['reviewInfo'].validate((valid) => {
        if (valid) {
          updateReview(data).then(response => {
            const res = response.data
            if (res.code === 10000) {
              this.$notify({
                title: '成功',
                message: '审核成功',
                type: 'success',
                duration: 2000
              })
              for (let i = 0; i < this.reviewStatusOptions.length; i++) {
                if (this.reviewStatusOptions[i].value === this.reviewStatus) {
                  this.currentRow.reviewStatus = this.reviewStatusOptions[i].name
                }
              }
              this.reviews.splice(this.currentIndex, 1, this.currentRow)
            }
          })
        }
      })

    }
  }
}
</script>
