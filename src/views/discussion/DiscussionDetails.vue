<template>
  <div class="app-container">
    <el-card class="box-card discuss-content">
      <div slot="header" class="clearfix discuss-head">
        <span>{{ discussInfo.title }}</span>
        <el-button style="float: right; padding: 3px 0" type="text">删除</el-button>
      </div>
      <div class="discuss-reply">
        <el-table
          v-loading="listLoading"
          :data="discussReply"
          fit
          highlight-current-row
          style="width: 98%;"
        >
          <el-table-column align="center" width="180">
            <template slot-scope="{row}">
              <div class="user-info">
                <el-badge :value="getValue(row)" class="item" :type="getType(row)">
                  <img :src="row.avatarUrl" height="120" width="120">
                  <el-link type="primary">{{ row.author }}</el-link>
                </el-badge>
              </div>
              <div class="reply-time">
                <span>{{ parseTime(row.time) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="1150">
            <template slot-scope="{row}">
              <pre>{{ row.text }}</pre>
              <el-button style="float: right;" type="primary" size="mini">回复</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="discussQuery.page"
          :limit.sync="discussQuery.limit"
          @pagination="getDiscussReply"
        />
      </div>
    </el-card>
    <el-card class="reply-content">
      <div slot="header" class="clearfix">
        <span>回复</span>
      </div>
      <el-input v-model="replyContent" type="textarea" rows="10" placeholder="请输入回复内容..." />
      <div class="submit">
        <el-button style="float: right;" type="primary">提交</el-button>
      </div>
    </el-card>

  </div>
</template>
<script>
import { fetchDiscussReply } from '@/api/discuss'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'DiscussionDetails',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      discussInfo: {
        id: this.$route.query.id,
        title: this.$route.query.title
      },
      discussReply: null,
      replyContent: '',
      total: 0,
      discussQuery: {
        page: 1,
        limit: 10,
        id: undefined
      },
      replyDialogVisible: false,
      deleteDialogVisible: false
    }
  },
  created() {
    this.getDiscussReply()
  },
  methods: {
    parseTime,
    getDiscussReply() {
      this.listLoading = true
      this.discussQuery.id = this.discussInfo.id
      fetchDiscussReply(this.discussQuery).then(response => {
        const res = response.data
        this.discussReply = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getValue(row) {
      if (row.replyOrder === 1) {
        return '发布者'
      } else {
        return row.replyOrder - 1
      }
    },
    getType(row) {
      if (row.replyOrder === 1) {
        return 'primary'
      } else {
        return 'info'
      }
    }
  }
}
</script>
<style scoped>
  .reply-content {
    margin-top: 30px;
  }
  .item {
    margin-top: 10px;
    margin-right: 60px;
  }
</style>
