<template>
  <div class="app-container">
    <div class="context-container">
      <div class="title-info" style="text-align:center">
        <h1>{{ problemDetail.title }}</h1>
        <p>TimeLimit:{{ problemDetail.timeLimit }}</p>
        <p>MemoryLimit:{{ problemDetail.memoryLimit }}</p>
        <p>64-bit integer IO format:
          <el-button type="info" size="mini">{{ problemDetail.intFormat }}</el-button>
        </p>
      </div>
      <el-form ref="problemDetail" :model="problemDetail" label-width="80px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>问题描述</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
          <div class="text item">
            <Tinymce ref="editor" v-model="problemDetail.description" :height="400" />
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>输入</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
          <div class="text item">
            <Tinymce ref="editor" v-model="problemDetail.input" :height="400" />
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>输出</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
          <div class="text item">
            <Tinymce ref="editor" v-model="problemDetail.output" :height="400" />
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>输入样例</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
          <div class="text item">
            <Tinymce ref="editor" v-model="problemDetail.inputCase" :height="400" />
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>输出样例</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
          <div class="text item">
            <Tinymce ref="editor" v-model="problemDetail.outputCase" :height="400" />
          </div>
        </el-card>
        <el-form-item>
          <el-button type="primary" @click="handleUpdate(problemDetail)">提交</el-button>
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
      problemDetail: {
        title: '',
        timeLimit: '',
        memoryLimit: '',
        intFormat: '',
        spj: '',
        description: '',
        input: '',
        output: '',
        inputCase: '',
        outputCase: '',
        hint: ''
      }
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
        this.problemDetail = res.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleUpdate(problemDetail) {
      this.listLoading = true
      updateProblem(problemDetail).then(response => {
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
