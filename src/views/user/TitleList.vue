<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="titleQuery.name" placeholder="标签名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加称号
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="titles"
      border
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.titleID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="称号" width="400" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="200" align="center">
        <template slot-scope="{row}">
          <el-image
            style="width: 140px; height: 140px"
            :src="row.pictureUrl"
            :fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="类型" width="250" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拥有时长" width="250" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lifeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="currentRow = row, currentIndex = $index, updateDialogVisible = true">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="currentRow = row, currentIndex = $index, deleteDialogVisible = true">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="titleQuery.page" :limit.sync="titleQuery.limit" @pagination="getTitles" />

    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <span>确定删除该称号？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">否</el-button>
        <el-button type="primary" @click="deleteTitle">是</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加称号" :visible.sync="addDialogVisible">
      <el-form ref="createTitle" :model="createTitleTemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="称号ID" prop="titleID">
          <el-input v-model="createTitleTemp.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createTitle">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTitleList, deleteTitle, updateTitle, createTitle } from '@/api/title'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'TitleList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      titles: null,
      total: 0,
      listLoading: true,
      titleQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        name: undefined
      },
      deleteDialogVisible: false,
      createDialogVisible: false,
      updateDialogVisible: false,
      createTitleTemp: {
        userID: '',
        userName: '',
        titleID: '',
        name: '',
        obtainTime: '',
        expireTime: '永久'
      },
      rules: {
      }
    }
  },
  created() {
    this.getTitles()
  },
  methods: {
    getTitles() {
      this.listLoading = true
      fetchTitleList(this.titleQuery).then(response => {
        const res = response.data
        this.titles = res.data.list
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.createTitleTemp = {
      }
    },
    handleFilter() {
      this.titleQuery.page = 1
      this.getTitles()
    },
    clearFilter() {
      this.titleQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        name: undefined
      }
      this.getTitles()
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
        this.titleQuery.sort = '+id'
      } else {
        this.titleQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCreate() {
      this.resetTemp()
      this.createDialogVisible = true
      this.$nextTick(() => {
        this.$refs['createTitle'].clearValidate()
      })
    },
    createTitle() {
      this.$refs['createTitle'].validate((valid) => {
        if (valid) {
          const date = new Date()
          this.createTitleTemp.userName = this.userTitleQuery.userName
          this.createTitleTemp.userID = this.userTitleQuery.userID
          this.createTitleTemp.time = parseTime(date)
          createTitle(this.createTitleTemp).then(response => {
            this.addDialogVisible = false
            const res = response.data
            if (res.code === 10000) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            }
            // this.userTitle.unshift(this.temp)
            this.getUserTitle()
          })
        }
      })
    },
    deleteTitle() {
      this.deleteDialogVisible = false
      const row = this.currentRow
      const index = this.currentIndex
      deleteTitle(row.titleID).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.titles.splice(index, 1)
        }
      })
    }
  }
}
</script>
