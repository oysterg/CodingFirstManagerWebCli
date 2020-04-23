<template>
  <div class="app-container">
    <div class="context-container">
      <div class="title-info" style="text-align:center">
        <h1>{{ problemInfo.title }}</h1>
        <p>TimeLimit:{{ problemView.timeLimit }}</p>
        <p>MemoryLimit:{{ problemView.memoryLimit }}</p>
        <p>64-bit integer IO format:
          <el-button type="info" size="mini">{{ problemView.intFormat }}</el-button>
        </p>
      </div>
      <el-form ref="problemDetail" label-width="80px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>问题描述</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
          <div class="text item">
            <Tinymce ref="editor" v-model="problemView.description" :height="400" />
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>输入</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
          <div class="text item">
            <Tinymce ref="editor" v-model="problemView.input" :height="400" />
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>输出</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
          <div class="text item">
            <Tinymce ref="editor" v-model="problemView.output" :height="400" />
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>输入样例</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
          <div class="text item">
            <Tinymce ref="editor" v-model="problemSample.inputCase" :height="400" />
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>输出样例</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
          <div class="text item">
            <Tinymce ref="editor" v-model="problemSample.outputCase" :height="400" />
          </div>
        </el-card>
        <el-form-item>
          <el-button type="primary" @click="handleUpdate(problemView, problemSample)">提交</el-button>
          <el-button @click="beforeRouteLeave">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { fetchProblem, updateProblem } from '@/api/problems'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'EditProblems',
  components: { Tinymce },
  data() {
    return {
      problemInfo: '',
      problemView: '',
      problemSample: ''
    }
  },
  created() {
    this.getProblemDetail()
  },
  methods: {
    getProblemDetail() {
      this.listLoading = true
      const id = this.$route.query.id
      fetchProblem(id).then(response => {
        const res = response.data
        this.problemInfo = res.datas[0]
        this.problemView = res.datas[1]
        this.problemSample = res.datas[2]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleUpdate(problemView, problemSample) {
      this.listLoading = true
      const data = {
        problemId: problemView.problemId,
        description: problemView.description,
        input: problemView.input,
        output: problemView.output,
        inputCase: problemView.inputCase,
        outputCase: problemView.outputCase
      }
      updateProblem(data).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        }
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.go(-1)
      })
    },
    beforeRouteLeave(to, from, next) {
      this.$confirm('正在离开本页面，本页面内所有未保存数据都会丢失', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
      // 如果取消跳转地址栏回退到之前位置
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.go(-1)
      })
    }
  }
}
</script>
<style scoped>
  .box-card {
    margin:0 auto;
    width: 1300px;
  }
</style>
