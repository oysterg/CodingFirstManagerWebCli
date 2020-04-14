<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="userQuery.usernameOrNickName" placeholder="用户名/昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="users"
      border
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="120" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="getUserDetail(row)">{{ row.username }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Moto" width="350" align="center">
        <template slot-scope="{row}">
          <span>{{ row.moto }}</span>
        </template>
      </el-table-column>
      <el-table-column label="AC" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.AC }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Rating" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rating }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ACB" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ACB }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row}">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作菜单<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getUserTitle(row)">称号管理</el-dropdown-item>
              <el-dropdown-item @click.native="getUserDetail(row)">统计数据</el-dropdown-item>
              <el-dropdown-item @click.native="handleRewardACB(row)">奖励ACB</el-dropdown-item>
              <el-dropdown-item @click.native="getCheckIn(row)">签到记录</el-dropdown-item>
              <el-dropdown-item @click.native="handleResetPsw(row)">重置密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="getUsers" />

    <el-dialog title="奖励ACB" :visible.sync="rewardACBDialogVisible">
      <el-form ref="rewardACB" :model="rewardACBTemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户ID" prop="id">
          <span>{{ rewardACBTemp.id }}</span>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <span>{{ rewardACBTemp.username }}</span>
        </el-form-item>
        <el-form-item label="ACB" prop="ACB">
          <el-input-number v-model="rewardACBTemp.ACB" :min="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rewardACBDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="rewardACB()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="resetPswDialogVisible"
      width="30%"
    >
      <span>确定重置该用户密码？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPswDialogVisible = false">否</el-button>
        <el-button type="primary" @click="resetPsw">是</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchUserList, updateACB, updatePsw } from '@/api/user'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      rewardACBDialogVisible: false,
      resetPswDialogVisible: false,
      currentRow: '',
      currentIndex: '',
      users: null,
      total: 0,
      listLoading: true,
      userQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        usernameOrNickname: undefined
      },
      rewardACBTemp: {
        id: '',
        username: '',
        ACB: '200'
      }
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      this.listLoading = true
      fetchUserList(this.userQuery).then(response => {
        const res = response.data
        this.users = res.data.list
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.userQuery.page = 1
      this.getUsers()
    },
    clearFilter() {
      this.userQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        usernameOrNickname: undefined
      }
      this.getUsers()
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
        this.userQuery.sort = '+id'
      } else {
        this.userQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: '',
        username: '',
        ACB: '200'
      }
    },
    handleRewardACB(row) {
      this.resetTemp()
      this.rewardACBDialogVisible = true
      this.currentRow = row
      this.rewardACBTemp.id = row.id
      this.rewardACBTemp.username = row.username
      this.$nextTick(() => {
        this.$refs['rewardACB'].clearValidate()
      })
    },
    rewardACB() {
      this.listLoading = true
      updateACB(this.temp).then(response => {
        const res = response.data
        this.rewardACBDialogVisible = false
        if (res.code === 10000) {
          this.$notify({
            message: '赠送成功',
            type: 'success'
          })
        }
        this.getUsers()
      })
    },
    handleResetPsw(row) {
      this.resetPswDialogVisible = true
      this.currentRow = row
    },
    resetPsw() {
      this.listLoading = true
      updatePsw(this.currentRow).then(response => {
        const res = response.data
        this.resetPswDialogVisible = false
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '重置成功',
            type: 'success',
            duration: 2000
          })
        }
        this.getUsers()
      })
    },
    getUserTitle(row) {
      this.$router.push({ path: '/user/userTitle', query: { id: row.id, name: row.username }})
    },
    getUserDetail(row) {
      this.$router.push({ path: '/user/userDetail', query: { id: row.id }})
    }
  }
}
</script>
