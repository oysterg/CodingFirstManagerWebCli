<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="problemsQuery.title"
        placeholder="标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="problemsQuery.difficultLevel"
        placeholder="难度"
        filterable
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option v-for="item in difficultyOptions" :key="item.name" :label="item.name" :value="item.value" />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">查看所有</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加题目</el-button>`
    </div>

    <el-table
      v-loading="listLoading"
      :data="problems"
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="problemId" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.problemId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="590" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="goProblemDetail(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="通过率" width="120">
        <template slot-scope="{row}">
          <span>{{ row.ratio }}</span>
        </template>
      </el-table-column>
      <el-table-column label="难度" width="120" align="center">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            :type="row.difficulty==='简单'?'success': row.difficulty==='中等'? 'warning':'danger'"
            plain
          >{{ row.difficulty }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="来源" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.belongOj }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.visible === 1 ? '显示' : '隐藏' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="currentRow = row, currentIndex = $index, deleteDialogVisible = true"
          >删除
          </el-button>
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

    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span>确定删除本题目？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">否</el-button>
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
  name: 'LocalProblems',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      deleteDialogVisible: false,
      problems: null,
      total: 0,
      listLoading: true,
      problemsQuery: {
        page: 1,
        limit: 20,
        sort: undefined,
        title: undefined,
        difficultLevel: undefined
      },
      tagsQuery: {
        page: 1,
        limit: 100
      },
      difficultyOptions: [
        {
          value: 1,
          name: '简单'
        },
        {
          value: 2,
          name: '中等'
        },
        {
          value: 3,
          name: '困难'
        }
      ],
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
        this.problems = res.datas[0]
        this.total = res.datas[1]
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
        sort: undefined,
        title: undefined,
        difficultLevel: undefined
      }
      this.getProblems()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'problemId') {
        this.problemsQuery.sort = order
      }
      this.handleFilter()
    },
    handleUpdate(row) {
      this.$router.push({
        path: '/problems/EditProblems',
        query: { id: row.problemId }
      })
    },
    handleCreate() {},
    deleteProblem() {
      this.deleteDialogVisible = false
      const row = this.currentRow
      const index = this.currentIndex
      deleteProblem(row.problemId).then(response => {
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
        query: { id: row.problemId }
      })
    }
  }
}
</script>
