<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tagsQuery.name" placeholder="标签名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加标签
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="tags"
      border
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.tagID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签名称" width="605" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="用户" width="200" align="center">
        <template slot-scope="{row}">
          <el-button size="mini">
            {{ row.userName }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="300" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handleUpdate(row, $index)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="currentRow = row, currentIndex = $index, deleteDialogVisible = true">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="tagsQuery.page" :limit.sync="tagsQuery.limit" @pagination="getTags" />

    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <span>确定删除该标签？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">否</el-button>
        <el-button type="primary" @click="handleDelete">是</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="dialogStatus === 'update'? '编辑标签':'添加标签'" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='update'?updateTag():createTag()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { fetchTagList, createTag, updateTag, deleteTag } from '@/api/tags'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'ProblemsTag',
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
      tags: null,
      total: 0,
      listLoading: true,
      tagsQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        name: undefined
      },
      deleteDialogVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      temp: {
        id: '',
        tagID: '',
        name: '',
        userName: '',
        time: ''
      },
      rules: {
      }
    }
  },
  created() {
    this.getTags()
  },
  methods: {
    getTags() {
      this.listLoading = true
      fetchTagList(this.tagsQuery).then(response => {
        const res = response.data
        this.tags = res.data.list
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: '',
        tagID: '',
        name: '',
        userName: '',
        time: ''
      }
    },
    handleFilter() {
      this.tagsQuery.page = 1
      this.getTags()
    },
    clearFilter() {
      this.tagsQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        name: undefined
      }
      this.getTags()
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
        this.tagsQuery.sort = '+id'
      } else {
        this.tagsQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createTag() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const date = new Date()
          this.temp.id = parseInt(Math.random() * 100) + 1024 // 模拟一个ID
          this.temp.tagID = parseInt(Math.random() * 100) + 1024
          this.temp.userName = store.getters.name
          this.temp.time = parseTime(date)
          createTag(this.temp).then(response => {
            this.tags.unshift(this.temp)
            this.dialogVisible = false
            const res = response.data
            if (res.code === 10000) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row, index) {
      this.resetTemp()
      this.dialogStatus = 'update'
      this.dialogVisible = true
      this.currentRow = row
      this.currentIndex = index
      this.temp.name = row.name
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateTag() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = this.currentRow.id
          this.temp.tagID = this.currentRow.tagID
          this.temp.userName = this.currentRow.userName
          this.temp.time = this.currentRow.time
          updateTag(this.temp).then(response => {
            const index = this.tags.findIndex(v => v.tagID === this.temp.tagID)
            this.tags.splice(index, 1, this.temp)
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
      deleteTag(row.tagID).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.tags.splice(index, 1)
        }
      })
    }
  }
}
</script>
