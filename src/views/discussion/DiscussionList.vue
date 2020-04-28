<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="discussQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="discussQuery.author" placeholder="发布者" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增讨论
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="discussion"
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="570" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="getDetail(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="发表时间" prop="time" sortable="custom" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布者" width="140" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="getUserDetail(row)">{{ row.author }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="回复数" align="center" width="70">
        <template slot-scope="{row}">
          <span>{{ row.replyNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" width="140" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="updatePriority(row)">{{ row.priority }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="danger" @click="currentRow = row, currentIndex = $index, deleteDialogVisible = true">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="discussQuery.pageNum" :limit.sync="discussQuery.pageSize" @pagination="getDiscussions" />

    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <span>确定删除该讨论？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">否</el-button>
        <el-button type="primary" @click="handleDelete">是</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDiscussList, deleteDiscussion } from '@/api/discuss'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'DiscussionList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      discussion: null,
      total: 0,
      listLoading: true,
      discussQuery: {
        pageNum: 1,
        pageSize: 10,
        sort: undefined,
        title: undefined,
        author: undefined
      },
      deleteDialogVisible: false,
      dialogVisible: false
    }
  },
  created() {
    this.getDiscussions()
  },
  methods: {
    parseTime,
    getDiscussions() {
      this.listLoading = true
      fetchDiscussList(this.discussQuery).then(response => {
        const res = response.data
        this.discussion = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.discussQuery.pageNum = 1
      this.getDiscussions()
    },
    clearFilter() {
      this.discussQuery = {
        pageNum: 1,
        pageSize: 10,
        sort: undefined,
        title: undefined,
        author: undefined
      }
      this.getDiscussions()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'time') {
        this.discussQuery.sort = order
        this.handleFilter()
      }
    },
    getDetail(row) {
      this.$router.push({
        path: '/discuss/DiscussionDetails',
        query: { id: row.id, title: row.title }
      })
    },
    handleDelete() {
      this.deleteDialogVisible = false
      const row = this.currentRow
      const index = this.currentIndex
      deleteDiscussion(row.id).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.discussion.splice(index, 1)
        }
      })
    }
  }
}
</script>
