<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="vjProblemsQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="vjProblemsQuery.OJId" placeholder="OJ" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in Ojs"
          :key="item.name"
          :value="item.name"
        />
      </el-select>
      <el-input v-model="vjProblemsQuery.probNum" placeholder="题号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="vjProblemsQuery.source" placeholder="来源" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="warning" @click="handleUpdate">
        更新缓存
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="vjProblems"
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="OJ" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.originOJ }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.originProb }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="400" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="goProblemDetail(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.triggerTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" width="380" align="center">
        <template slot-scope="{row}">
          <span v-html="row.source" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
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
      <span>确定删除本题目缓存？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">否</el-button>
        <el-button type="primary" @click="handleDelete">是</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchVJProblemList, fetchOjs } from '@/api/problems'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'LocalProblems',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      dialogVisible: false,
      vjProblems: null,
      Ojs: null,
      total: 0,
      listLoading: true,
      vjProblemsQuery: {
        pageNum: 1,
        pageSize: 20,
        sort: undefined,
        title: undefined,
        OJId: undefined,
        probNum: undefined,
        source: undefined
      },
      dialogStatus: '',
      rules: {
      }
    }
  },
  created() {
    this.getVJProblems()
    this.getOjs()
  },
  methods: {
    parseTime,
    getVJProblems() {
      this.listLoading = true
      fetchVJProblemList(this.vjProblemsQuery).then(response => {
        const res = response.data
        this.vjProblems = res.datas[0].data
        this.total = res.datas[0].recordsTotal
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getOjs() {
      this.listLoading = true
      fetchOjs().then(response => {
        const res = response.data
        this.Ojs = res.datas[0]
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
        pageNum: 1,
        pageSize: 20,
        sort: undefined,
        title: undefined,
        OJId: undefined,
        probNum: undefined,
        source: undefined
      }
      this.getVJProblems()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'problemNum') {
        this.vjProblemsQuery.sort = order
        this.handleFilter()
      }
    },
    handleUpdate() {
    },
    goProblemDetail(row) {
      this.$router.push({ path: '/problems/VJProblemDetail', query: { probNum: row.originProb, OJId: row.originOJ }})
    }
  }
}
</script>
