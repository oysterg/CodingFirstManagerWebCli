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
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="ID" sortable="custom" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签名称" align="center">
        <template slot-scope="{row, $index}">
          <el-link type="primary" @click="handleUpdate(row, $index)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="200" align="center">
        <template slot-scope="{row}">
          <el-button size="mini">
            {{ row.createUser }}
          </el-button>
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

    <el-dialog :rule="rules" :title="dialogStatus === 'update'? '编辑标签':'添加标签'" :visible.sync="dialogVisible">
      <el-form ref="tagInfo" :model="tagInfoTemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="tagInfoTemp.name" />
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
import { fetchTagList, createTag, updateTag, deleteTag } from '@/api/tag'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination

export default {
  name: 'ProblemsTag',
  components: { Pagination },
  directives: { waves },
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
        sort: undefined,
        name: undefined
      },
      deleteDialogVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      tagInfoTemp: {
        id: '',
        name: '',
        tagType: '',
        createUser: '',
        priority: ''
      },
      rules: {
        name: [
          { required: true, message: '标签名不能为空', trigger: 'change' }
        ]
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
        this.tags = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.tagInfoTemp = {
        id: '',
        name: '',
        tagType: '',
        createUser: '',
        priority: ''
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
        sort: undefined,
        name: undefined
      }
      this.getTags()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'ID') {
        this.tagsQuery.sort = order
        this.handleFilter()
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['tagInfo'].clearValidate()
      })
    },
    createTag() {
      this.$refs['tagInfo'].validate((valid) => {
        if (valid) {
          this.tagInfoTemp.tagType = 0 // 暂时默认
          this.tagInfoTemp.priority = 0 // 暂时 默认
          this.tagInfoTemp.createUser = store.getters.name
          createTag(this.tagInfoTemp).then(response => {
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
          this.dialogVisible = false
          this.getTags()
        }
      })
    },
    handleUpdate(row, index) {
      this.resetTemp()
      this.dialogStatus = 'update'
      this.dialogVisible = true
      this.currentRow = row
      this.currentIndex = index
      this.tagInfoTemp.id = row.id
      this.tagInfoTemp.name = row.name
      this.tagInfoTemp.createUser = row.createUser
      this.tagInfoTemp.tagType = row.tagType // 暂不做修改
      this.tagInfoTemp.priority = row.priority // 暂不做修改
      this.$nextTick(() => {
        this.$refs['tagInfo'].clearValidate()
      })
    },
    updateTag() {
      this.$refs['tagInfo'].validate((valid) => {
        if (valid) {
          updateTag(this.tagInfoTemp).then(response => {
            const index = this.tags.findIndex(v => v.id === this.tagInfoTemp.id)
            this.tags.splice(index, 1, this.tagInfoTemp)
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
      deleteTag(row.id).then(response => {
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
