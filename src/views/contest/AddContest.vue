<template>
  <div id="app-container">
    <div class="contest-content">
      <el-card class="box-card">
        <el-form ref="contestInfo" label-positon="left" :rules="addContestRules" :model="contestInfo" label-width="120px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="contestInfo.title" style="width: 1000px" />
          </el-form-item>
          <el-form-item label="比赛起止时间" prop="beginTime">
            <el-date-picker
              v-model="registerBeginEndTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="报名类型">
            <el-select v-model="contestInfo.permissionType">
              <el-option value="公开" />
              <el-option value="私有" />
              <el-option value="密码" />
              <el-option value="注册" />
              <el-option value="正式" />
              <el-option value="组队" />
            </el-select>
          </el-form-item>
          <el-form-item label="报名起止时间" prop="registerBeginTime">
            <el-date-picker
              v-model="contestBeginEndTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="种类">
            <el-select v-model="contestInfo.contestKind">
              <el-option value="练习" />
              <el-option value="积分" />
              <el-option value="趣味" />
              <el-option value="正式" />
              <el-option value="自定义" />
            </el-select>
          </el-form-item>
          <el-form-item label="题目列表">
            <el-tag
              v-for="tag in contestInfo.problems"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-select
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag"
              placeholder="请选择或输入"
              filterable
              clearable
              @keyup.enter.native="handleInputConfirm"
              @change.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
              <el-option
                v-for="item in problemList"
                :key="item.problemID"
                :label="item.problemID"
                :value="item.problemID"
              />
            </el-select>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 题目ID</el-button>
          </el-form-item>
          <el-form-item label="描述">
            <div class="text item">
              <Tinymce ref="editor" v-model="contestInfo.description" :width="1000" :height="400" />
            </div>
          </el-form-item>
          <el-form-item label="封榜时间" placeholder="分钟">
            <el-input-number v-model="contestInfo.rankEndTime" :min="0" /> 分钟
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="contestInfo.computerRating">是否计算rating</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="contestInfo.problemPutTag">内部题目是否可以直接贴标签</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="contestInfo.computerGlobalCommit">计算排名时，是否把全局的提交也计算入内</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="contestInfo.registerCompleteInfo">注册是否需要完整的个人信息</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="contestInfo.showOtherStatus">是否隐藏其他人的提交</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="contestInfo.showBorderList">是否隐藏其他人的运行时间、空间和代码长度</el-checkbox>
          </el-form-item>
          <el-form-item label="Rank模式">
            <el-select v-model="contestInfo.rankType">
              <el-option value="ICPC" />
              <el-option value="ShortCode" />
              <el-option value="练习模式" />
              <el-option value="积分模式" />
            </el-select>
          </el-form-item>
          <el-form-item label="罚时" placeholder="分钟">
            <el-input-number v-model="contestInfo.punishTime" :min="0" />  分钟
          </el-form-item>
          <el-form-item label="金奖" placeholder="%">
            <el-input-number v-model="contestInfo.gold" />  %
          </el-form-item>
          <el-form-item label="银奖" placeholder="%">
            <el-input-number v-model="contestInfo.silver" />  %
          </el-form-item>
          <el-form-item label="铜奖" placeholder="%">
            <el-input-number v-model="contestInfo.copper" />  %
          </el-form-item>
          <el-form-item class="form-button">
            <el-button type="primary" @click="createContest(contestInfo)">提交</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>

import { createContest } from '@/api/contest'
import { fetchProblemList } from '@/api/problems'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'AddContest',
  components: { Tinymce },
  data() {
    return {
      contestBeginEndTime: [
        new Date(2000, 10, 10, 10, 10),
        new Date(2000, 10, 11, 10, 10)
      ],
      registerBeginEndTime: [
        new Date(2000, 10, 10, 10, 10),
        new Date(2000, 10, 11, 10, 10)
      ],
      inputVisible: false,
      inputValue: '',
      problemList: '',
      contestInfo: {
        title: '',
        contestKind: '',
        beginTime: '',
        endTime: '',
        registerBeginTime: '',
        registerEndTime: '',
        permissionType: '公开',
        problems: null,
        description: '',
        password: '',
        computerRating: '',
        rankType: 'ICPC',
        problemPutTag: '',
        statusReadOut: '',
        showRegisterOut: '',
        showRegisterList: '',
        showBorderList: '',
        showOtherStatus: '',
        createUser: '',
        createTime: '',
        registerCompleteInfo: '',
        computerGlobalCommit: '',
        punishTime: '',
        rankEndTime: '',
        gold: '10',
        silver: '30',
        copper: '60'
      },
      addContestRules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'change' }
        ],
        problems: [
          { required: true, message: '题目列表不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getProblemList()
    this.contestInfo.contestKind = this.$route.query.kind ? this.$route.query.kind : '练习'
  },
  methods: {
    getProblemList() {
      this.listLoading = true
      const problemsQuery = {
        page: 1,
        limit: 100,
        sort: '+id'
      }
      fetchProblemList(problemsQuery).then(response => {
        const res = response.data
        this.problemList = res.data.list
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    createContest() {
      this.$refs.contestInfo.validate(valid => {
        if (valid) {
          this.listLoading = true
          this.contestInfo.beginTime = this.contestBeginEndTime[0]
          this.contestInfo.endTime = this.contestBeginEndTime[1]
          this.contestInfo.registerBeginTime = this.registerBeginEndTime[0]
          this.contestInfo.registerEndTime = this.registerBeginEndTime[1]
          console.log(this.contestInfo.beginTime)
          console.log(this.contestInfo.endTime)
          createContest(this.contestInfo).then(response => {
            const res = response.data
            if (res.code === 10000) {
              this.$message({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
            this.goBack()
          })
        } else {
          console.log('提交错误!!')
          return false
        }
      })
    },
    handleClose(tag) {
      this.contestInfo.problems.splice(this.problems.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.select.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      console.log(inputValue)
      if (inputValue) {
        this.contestInfo.problems.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .box-card {
    width: 1400px;
    margin-top: 30px;
    margin-left: 30px;
  }
  .form-button {
    float: right;
  }
</style>
