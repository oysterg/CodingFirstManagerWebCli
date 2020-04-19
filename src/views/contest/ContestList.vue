<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="contestsQuery.title"
        placeholder="标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="contestsQuery.permission"
        placeholder="权限"
        filterable
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option v-for="item in permissionOptions" :key="item" :value="item" />
      </el-select>
      <el-select
        v-model="contestsQuery.status"
        placeholder="状态"
        filterable
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option v-for="item in statusOptions" :key="item" :value="item" />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">查看所有</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="contests"
      border
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.contestID }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标题"
        :width="contestsQuery.contestKind === '自定义' ? '400' : '500'"
        align="center"
      >
        <template slot-scope="{row}">
          <el-link type="primary" @click="getContestDetail(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.beginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="120" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" :type="getPermissionColor(row)" plain>{{ row.permissionType }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            :type="row.status === '正在进行' ? 'primary' : row.status === '未开始' ? 'info' : 'danger'"
            plain
          >{{ row.status }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="contestsQuery.contestKind === '自定义' ? true : false"
        label="创建者"
        width="150"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        :width="contestsQuery.contestKind === '自定义' ? '140' : '200'"
        class-name="small-padding"
      >
        <template slot-scope="{row}">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作菜单
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getContestDetail(row)">详细信息</el-dropdown-item>
              <el-dropdown-item @click.native="getProblemList(row)">题目列表</el-dropdown-item>
              <el-dropdown-item @click.native="getJudgeList(row)">评测列表</el-dropdown-item>
              <el-dropdown-item @click.native="getUserList(row)">参赛用户列表</el-dropdown-item>
              <el-dropdown-item @click.native="handleUpdate(row)">修改比赛信息</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="contestsQuery.page"
      :limit.sync="contestsQuery.limit"
      @pagination="getContests"
    />
  </div>
</template>

<script>

import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination

export default {
  name: 'ContestList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      permissionOptions: ['公开', '密码', '私有', '注册', '正式', '组队'],
      statusOptions: ['已结束', '未开始', '正在进行'],
      contests: null,
      total: 0,
      listLoading: true,
      contestsQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        contestKind: undefined,
        title: undefined,
        permission: undefined,
        status: undefined
      }
    }
  },
  created() {
    this.getContests()
  },
  methods: {
    getContests() {
      this.listLoading = true
      this.contestsQuery.contestKind = this.getContestKind()
      // fetchContestList(this.contestsQuery).then(response => {
      //   const res = response.data
      //   this.contests = res.data.list
      //   this.total = res.data.total
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
    },
    handleFilter() {
      this.contestsQuery.page = 1
      this.getContests()
    },
    clearFilter() {
      this.contestsQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        kind: undefined,
        title: undefined,
        permissionType: undefined,
        status: undefined
      }
      this.getContests()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.contestsQuery.sort = '+id'
      } else {
        this.contestsQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleUpdate() {},
    getContestDetail(row) {
      this.$router.push({
        path: '/contest/detail',
        query: { id: row.contestID }
      })
    },
    getUserList() {},
    getProblemList() {},
    getJudgeList() {},
    getContestKind() {
      const title = this.$route.meta.title
      if (title === '练习赛') {
        return '练习'
      } else if (title === '积分赛') {
        return '积分'
      } else if (title === '趣味赛') {
        return '趣味'
      } else if (title === '正式赛') {
        return '正式'
      } else {
        return '自定义'
      }
    },
    getPermissionColor(row) {
      const permission = row.permissionType
      const type =
        permission === '公开'
          ? 'success'
          : permission === '密码'
            ? 'primary'
            : permission === '私有'
              ? 'danger'
              : permission === '注册'
                ? 'warning'
                : permission === '正式'
                  ? 'primary'
                  : ''
      return type
    }
  }
}
</script>
