<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="honorRanksQuery.realName" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="honorRanksQuery.contestLevel" placeholder="比赛级别" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in contestLevel"
          :key="item.value"
          :value="item.value"
          :label="item.name"
        />
      </el-select>
      <el-select v-model="honorRanksQuery.awardLevel" placeholder="奖项级别" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in awardLevel"
          :key="item.value"
          :value="item.value"
          :label="item.name"
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
      :data="honorRanks"
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-card class="box-card">
              <el-form-item label="报名时间">
                <span>{{ parseTime(props.row.registerTime) }}</span>
              </el-form-item>
            </el-card>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="获奖时间" prop="rewardDate" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.rewardDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="队员1" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="getUserInfo(row.realNameOne)">{{ row.realNameOne }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="队员2" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="getUserInfo(row.realNameTwo)">{{ row.realNameTwo }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="队员3" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="getUserInfo(row.realNameThree)">{{ row.realNameThree }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="比赛级别" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.contestLevel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖项级别" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.awardLevel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" :width="honorRanksQuery.contestKind === '自定义' ? '140' : '200'" class-name="small-padding">
        <template slot-scope="{row, $index}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="currentRow = row, currentIndex = $index, dialogVisible = true">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="honorRanksQuery.pageNum" :limit.sync="honorRanksQuery.pageSize" @pagination="getHonorRanks" />

     <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>确定删除该条荣誉？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">否</el-button>
        <el-button type="primary" @click="deleteHonor">是</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchHonorRank, deleteHonor } from '@/api/rank'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'HonorRank',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      dialogVisible: false,
      awardLevel: [
        { name: '无奖项', value: -2 },
        { name: '顽强拼搏奖', value: -1 },
        { name: '优秀奖/鼓励奖', value: 0 },
        { name: '铜奖', value: 1 },
        { name: '银奖', value: 2 },
        { name: '金奖', value: 3 },
        { name: '一等奖', value: 4 },
        { name: '二等奖', value: 5 },
        { name: '三等奖', value: 6 }
      ],
      contestLevel: [
        { name: '其他、不显示在奖项列表中', value: -1 },
        { name: 'ACM省赛', value: 0 },
        { name: 'ACM/ICPC区域赛', value: 1 },
        { name: 'EC-Final', value: 2 },
        { name: '世界总决赛', value: 3 },
        { name: '全国蓝桥杯大赛', value: 4 },
        { name: 'ACM全国邀请赛', value: 5 },
        { name: '全国大学生程序设计竞赛', value: 6 },
        { name: '三等奖', value: 7 }
      ],
      honorRanks: null,
      total: 0,
      listLoading: true,
      honorRanksQuery: {
        pageNum: 1,
        pageSize: 20,
        sort: undefined,
        realName: undefined,
        awardLevel: undefined,
        contestLevel: undefined
      }
    }
  },
  created() {
    this.getHonorRanks()
  },
  methods: {
    parseTime,
    getHonorRanks() {
      this.listLoading = true
      fetchHonorRank(this.honorRanksQuery).then(response => {
        const res = response.data
        this.honorRanks = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.honorRanksQuery.pageNum = 1
      this.getHonorRanks()
    },
    clearFilter() {
      this.honorRanksQuery = {
        pageNum: 1,
        pageSize: 20,
        sort: undefined,
        realName: undefined,
        awardLevel: undefined,
        contestLevel: undefined
      }
      this.getHonorRanks()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'rewardDate') {
        this.honorRanksQuery.sort = order
        this.handleFilter()
      }
    },
    handleUpdate() {
    },
    deleteHonor() {
      this.dialogVisible = false
      const row = this.currentRow
      const index = this.currentIndex
      deleteHonor(row.id).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.honorRanks.splice(index, 1)
        }
      })
    }
  }
}
</script>
