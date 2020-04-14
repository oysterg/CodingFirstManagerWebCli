<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="judgesQuery.userName" placeholder="用户" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="judgesQuery.problemID" placeholder="题目ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="judgesQuery.result" placeholder="结果" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in resultOption"
          :key="item"
          :value="item"
        />
      </el-select>
      <el-select v-model="judgesQuery.language" placeholder="语言" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in languageOption"
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
      :data="judges"
      border
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.judgeID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="200" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.userName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="题目ID" width="120" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.problemID }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="评测结果" width="250" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" :type="resultType(row)" plain>
            <el-link>{{ row.result }}</el-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="语言" width="100" align="center">
        <template slot-scope="{row}">
          <el-link>{{ row.language }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="耗时" w idth="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.costTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用内存" w idth="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.costMemory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码长" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.codeLength }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.submitTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="reJudge(row, $index)">
            重判
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="judgesQuery.page" :limit.sync="judgesQuery.limit" @pagination="getJudges" />

  </div>
</template>

<script>
import { fetchJudgeList } from '@/api/judge'
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
      judges: null,
      total: 0,
      resultOption: ['Wrong Answer', 'Accepted', 'Output Limit Exceeded', 'Complication Error', 'Presentation Error'],
      languageOption: ['G++', 'Java', 'Python'],
      listLoading: true,
      judgesQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        problemID: undefined,
        nickName: undefined,
        result: undefined,
        language: undefined
      },
      rules: {
      }
    }
  },
  created() {
    this.getJudges()
  },
  methods: {
    getJudges() {
      this.listLoading = true
      fetchJudgeList(this.judgesQuery).then(response => {
        const res = response.data
        this.judges = res.data.list
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.judgesQuery.page = 1
      this.getJudges()
    },
    clearFilter() {
      this.judgesQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        problemID: undefined,
        nickName: undefined,
        result: undefined,
        language: undefined
      }
      this.getJudges()
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
        this.judgesQuery.sort = '+id'
      } else {
        this.judgesQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resultType(row) {
      const resultType = row.result === 'Accepted' ? 'success'
        : row.result === 'Complication Error' || row.result === 'Presentation Error' ? 'warning' : 'danger'
      return resultType
    },
    goJudgeDetail(row) {
      this.$router.push({ path: '/judge/judgeDetail', query: { id: row.judgeID }})
    }
  }
}
</script>
