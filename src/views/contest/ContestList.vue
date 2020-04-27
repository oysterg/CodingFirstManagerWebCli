<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="contestsQuery.searchName"
        placeholder="标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="contestsQuery.searchPermission"
        placeholder="权限"
        filterable
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in permissionOptions"
          :key="item.value"
          :label = "item.name"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="contestsQuery.searchStatus"
        placeholder="状态"
        filterable
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :value="item.value"
          :label="item.name"
        />
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
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标题"
        :width="contestsQuery.kind === '自定义' ? '400' : '488'"
        align="center"
      >
        <template slot-scope="{row}">
          <el-link type="primary" @click="getContestDetail(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.beginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="120" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" :type="getPermissionColor(row)" plain>{{ row.permission }}</el-button>
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
        v-if="contestsQuery.kind === '自定义'"
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
        :width="contestsQuery.kind === '自定义' ? '140' : '200'"
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
      :page.sync="contestsQuery.pageNum"
      :limit.sync="contestsQuery.pageSize"
      @pagination="getContests"
    />
  </div>
</template>

<script>

import { fetchContestList } from '@/api/contest'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'ContestList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      permissionOptions: [
        { name: '公开', value: 0 },
        { name: '密码', value: 1 },
        { name: '私有', value: 2 },
        { name: '注册', value: 3 },
        { name: '正式', value: 4 },
        { name: '组队', value: 5 }
      ],
      statusOptions: [
        { name: '未开始', value: 0 },
        { name: '正在进行', value: 1 },
        { name: '已结束', value: 2 }
      ],
      contests: null,
      total: 0,
      listLoading: true,
      contestsQuery: {
        pageNum: 1,
        pageSize: 10,
        kind: undefined,
        searchName: undefined,
        searchPermission: undefined,
        searchStatus: undefined
      }
    }
  },
  created() {
    this.getContests()
  },
  methods: {
    parseTime,
    getContests() {
      this.listLoading = true
      this.contestsQuery.kind = this.getContestKind()
      fetchContestList(this.contestsQuery).then(response => {
        const res = response.data
        this.contests = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.contestsQuery.page = 1
      this.getContests()
    },
    clearFilter() {
      this.contestsQuery = {
        pageNum: 1,
        pageSize: 10,
        kind: undefined,
        searchName: undefined,
        searchPermission: undefined,
        searchStatus: undefined
      }
      this.getContests()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.contestsQuery.sort = order
      }
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
        return 0
      } else if (title === '积分赛') {
        return 1
      } else if (title === '趣味赛') {
        return 2
      } else if (title === '正式赛') {
        return 3
      } else if (title === '自定义') {
        return 5
      } else {
        return 4
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
