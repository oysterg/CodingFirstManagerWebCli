<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="challengeQuery.name" placeholder="模块名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加模块
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="challenges"
      border
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
      <el-table-column label="模块名称" width="200" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="模块类型" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.blockType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前置模块" width="200" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.preUnlockNum }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="所需积分" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.preUnlockScore }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="400" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="170" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作菜单<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getChallengeProblems(row)">查看题目</el-dropdown-item>
              <el-dropdown-item @click.native="handleUpdate(row, $index)">修改</el-dropdown-item>
              <el-dropdown-item @click.native="currentRow = row, currentIndex = $index, deleteDialogVisible = true">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="challengeQuery.page" :limit.sync="challengeQuery.limit" @pagination="getChallenges" />

    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <span>确定删除该挑战模块？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">否</el-button>
        <el-button type="primary" @click="handleDelete">是</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchChallengeList, deleteChallenge, updateChallenge } from '@/api/challenge'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination

export default {
  name: 'ChallengeList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      challenges: null,
      total: 0,
      listLoading: true,
      challengeQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        name: undefined
      },
      dialogVisible: false,
      deleteDialogVisible: false
    }
  },
  created() {
    this.getChallenges()
  },
  methods: {
    getChallenges() {
      this.listLoading = true
      fetchChallengeList(this.challengeQuery).then(response => {
        const res = response.data
        this.challenges = res.data.list
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.challengeQuery.page = 1
      this.getChallenges()
    },
    clearFilter() {
      this.challengeQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        name: undefined
      }
      this.getChallenges()
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
        this.challengeQuery.sort = '+id'
      } else {
        this.challengeQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCreate() {
      this.$router.push({
        path: '/challenge/AddChallenge'
      })
    },
    handleUpdate(row, index) {
      this.$router.push({
        path: '/challenge/UpdateChallenge',
        query: { id: row.id }
      })
    },
    updateChallenge() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = this.currentRow.id
          this.temp.tagID = this.currentRow.tagID
          this.temp.userName = this.currentRow.userName
          this.temp.time = this.currentRow.time
          updateChallenge(this.temp).then(response => {
            const index = this.challenges.findIndex(v => v.tagID === this.temp.tagID)
            this.challenges.splice(index, 1, this.temp)
            this.dialogVisible = false
            const res = response.data
            if (res.code === 10000) {
              this.$message({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete() {
      this.deleteDialogVisible = false
      const row = this.currentRow
      const index = this.currentIndex
      deleteChallenge(row.id).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.challenges.splice(index, 1)
        }
      })
    }
  }
}
</script>
