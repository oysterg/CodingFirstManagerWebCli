<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="vjProblemsQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="vjProblemsQuery.OJ" placeholder="OJ" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in vjProblems"
          :key="item.OJ"
          :value="item.OJ">
        </el-option>
      </el-select>
      <el-input v-model="vjProblemsQuery.problemID" placeholder="题号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="vjProblemsQuery.source" placeholder="来源" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="goCreate">
        添加题目
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="vjProblems"
      border
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="OJ" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.OJ }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.problemID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="400" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="goProblemDetail(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" width="380" align="center">
        <template slot-scope="{row}">
          <span>{{ row.source }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="goUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="currentRow = row, currentIndex = $index, dialogVisible = true">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="vjProblemsQuery.page" :limit.sync="vjProblemsQuery.limit" @pagination="getVJProblems" />

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>确定删除本题目？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">否</el-button>
        <el-button type="primary" @click="handleDelete">是</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchVJProblemList, deleteVJProblem } from '@/api/problems'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination

export default {
  name: 'LocalProblems',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusColor = {
        edit: 'brand color',
        delete: 'danger',
        tags: 'success',
        statistic: 'warning'
      }
      return statusColor[status]
    }
  },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      dialogVisible: false,
      vjProblems: null,
      total: 0,
      listLoading: true,
      vjProblemsQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        title: undefined,
        OJ: undefined,
        problemID: undefined,
        source: undefined
      },
      difficultyOptions: ['简单', '中等', '困难'],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
      }
    }
  },
  created() {
    this.getVJProblems()
  },
  methods: {
    getVJProblems() {
      this.listLoading = true
      fetchVJProblemList(this.vjProblemsQuery).then(response => {
        const res = response.data
        this.vjProblems = res.data.list
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.vjProblemsQuery.page = 1
      this.getVJProblems()
    },
    clearFilter() {
      this.vjProblemsQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        title: undefined,
        OJ: undefined,
        problemID: undefined,
        source: undefined
      }
      this.getVJProblems()
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
        this.vjProblemsQuery.sort = '+id'
      } else {
        this.vjProblemsQuery.sort = '-id'
      }
      this.handleFilter()
    },
    goCreate() {
    },
    goUpdate(row) {
      this.$router.push({ path: '/problems/EditProblems', query: { id: row.problemID }})
    },
    handleDelete() {
      this.dialogVisible = false
      const row = this.currentRow
      const index = this.currentIndex
      deleteVJProblem(row.problemID).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.problems.splice(index, 1)
        }
      })
    },
    goProblemDetail(row) {
      this.$router.push({ path: '/problems/ProblemDetail', query: { id: row.problemID }})
    }
  }
}
</script>
