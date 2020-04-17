<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        placeholder="来源站点"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        placeholder="源题目ID"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="problemsQuery.title"
        placeholder="标题"
        style="width: 220px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">查看所有</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="warning">爬取题目</el-button>`
    </div>

    <el-table
      v-loading="listLoading"
      :data="problems"
      border
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="标记ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.problemID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源站点" width="140" align="center">
        <template>
          <!-- TODO: -->
          <span>HDU</span>
        </template>
      </el-table-column>
      <el-table-column label="源题目ID" width="140" align="center">
        <template>
          <!-- TODO: -->
          <span>1000</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="goProblemDetail(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="来自爬虫任务" width="160" align="center">
        <template>
          <!-- TODO: -->
          <span>FULLHDU-de4a8</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template>
          <!-- TODO: -->
          <span>暂未本地化</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="currentRow = row, currentIndex = $index, dialogVisible = true"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="problemsQuery.page"
      :limit.sync="problemsQuery.limit"
      @pagination="getProblems"
    />

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定删除本题目？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">否</el-button>
        <el-button type="primary" @click="deleteProblem">是</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchProblemList, deleteProblem } from '@/api/problems'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination

export default {
  name: 'TempProblems',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      dialogVisible: false,
      problems: null,
      total: 0,
      tags: null,
      listLoading: true,
      problemsQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        title: undefined
      },
      tagsQuery: {
        page: 1,
        limit: 100,
        sort: '+id'
      },

      rules: {}
    }
  },
  created() {
    this.getProblems()
  },
  methods: {
    getProblems() {
      this.listLoading = true
      fetchProblemList(this.problemsQuery).then(response => {
        const res = response.data
        this.problems = res.data.list
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.problemsQuery.page = 1
      this.getProblems()
    },
    clearFilter() {
      this.problemsQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        title: undefined
      }
      this.getProblems()
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
        this.problemsQuery.sort = '+id'
      } else {
        this.problemsQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCreate() {},
    handleUpdate(row) {
      this.$router.push({
        path: '/problems/EditProblems',
        query: { id: row.problemID }
      })
    },
    deleteProblem() {
      this.dialogVisible = false
      const row = this.currentRow
      const index = this.currentIndex
      deleteProblem(row.problemID).then(response => {
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
      this.$router.push({
        path: '/problems/ProblemDetail',
        query: { id: row.problemID }
      })
    }
  }
}
</script>
