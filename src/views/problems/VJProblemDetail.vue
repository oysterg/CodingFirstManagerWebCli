<template>
  <div class="app-container">
    <div class="context-container">
      <div class="problem-basic">
        <div class="title">
          <h1>{{ problemInfo.probTitle }}</h1>
          <p>TimeLimit:{{ problemInfo.timeLimit }}</p>
          <p>MemoryLimit:{{ problemInfo.memoryLimit }}</p>
          <p>64-bit integer IO format:
            <el-button type="info" size="mini">{{  }}</el-button>
          </p>
        </div>
        <div class="info">
          <span class="mark">已有{{ totalStar ? totalStar : 0 }}人收藏此题</span>
          <span class="tag">标签数
            <el-link type="primary" @click="goTagsDetail(problemInfo)">{{ totalTag ? totalTag : 0 }}</el-link>
          </span>
        </div>
      </div>
      <div class="problem-content" style="display: flex">
        <div class="problem-detail">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>问题描述</span>
            </div>
            <el-link>{{ problemInfo.problemDescriptionUrl }}</el-link>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>输入</span>
            </div>
            <div
              class="text item"
              v-html="无"
            />
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>输出</span>
            </div>
            <div
              class="text item"
              v-html="无"
            />
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>输入样例</span>
            </div>
            <div
              class="text item"
              v-html="无"
            />
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>输出样例</span>
            </div>
            <div
              class="text item"
              v-html="无"
            />
          </el-card>
        </div>
        <div class="problem-stastic">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>统计信息</span>
              <el-button style="float: right; padding: 3px 0" type="text">详情</el-button>
            </div>
            <div class="stastic-content">
              <p>总AC数
                <el-link type="primary" class="data">{{ 无 }}</el-link>
              </p>
              <p>通过人数
                <el-link type="primary" class="data">{{ 无 }}</el-link>
              </p>
              <p>尝试人数
                <el-link type="primary" class="data">{{ 无 }}</el-link>
              </p>
              <p>总提交量
                <el-link type="primary" class="data">{{ 无 }}</el-link>
              </p>
              <p>AC率
                <span class="data">{{ (无 / 无).toFixed(2) }}%</span>
              </p>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchVJProblem } from '@/api/problems'

export default {
  name: 'VJProblemDetail',
  data() {
    return {
      problemInfo: '',
      totalStar: '',
      totalTag: ''
    }
  },
  created() {
    this.getProblemInfo()
  },
  methods: {
    getProblemInfo() {
      this.listLoading = true
      const query = {
        probNum: this.$route.query.probNum,
        OJId: this.$route.query.OJId,
        username: ''
      }
      fetchVJProblem(query).then(response => {
        const res = response.data
        this.problemInfo = res.datas[0]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    goTagsDetail(problemInfo) {
    }
  }
}
</script>
<style scoped>
  .problem-detail .box-card, .problem-basic .info {
    width: 1100px;
  }
  .problem-detail .box-card {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .problem-basic .title{
    position: relative;
    left: 500px;
  }
  .problem-basic .info .tag {
    float: right;
  }
  .problem-stastic {
    float: right;
    margin-left: 20px;
    margin-top: 10px;
  }
  .problem-stastic .box-card {
    width: 300px;
  }
  .stastic-content .data{
    float: right;
  }
</style>
