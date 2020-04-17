<template>
  <div id="app-container">
    <div class="challenge-content">
      <el-card class="box-card">
        <el-form ref="challengeInfo" label-positon="left" :rules="addChallengeRules" :model="challengeInfo" label-width="120px">
          <el-form-item label="模块名称" prop="name">
            <el-input v-model="challengeInfo.name" style="width: 1000px" />
          </el-form-item>
          <el-form-item label="描述">
            <div class="text item">
              <Tinymce ref="editor" v-model="challengeInfo.description" :width="1000" :height="400" />
            </div>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="challengeInfo.blockType" placeholder="模块类型">
              <el-option value="基础" />
              <el-option value="图论" />
              <el-option value="数学" />
              <el-option value="几何" />
              <el-option value="动态规划" />
              <el-option value="数据结构" />
              <el-option value="搜索" />
            </el-select>
          </el-form-item>
          <el-form-item label="开启条件">
            <span>在模块</span>
            <el-select v-model="preCondition.preConditionBlockID" placeholder="模块" filterable clearable>
              <el-option
                v-for="item in challengeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <span>中获得</span>
            <el-input-number v-model="preCondition.preConditionBlockScore" :min="1" />  积分
            <el-button type="primary" @click="addPreCondition(preCondition.preConditionBlockID, preCondition.preConditionBlockScore)">添加条件</el-button>
            <div class="problem-list">
              <el-table
                v-loading="listLoading"
                :data="challengeInfo.preConditionBlock"
                fit
                highlight-current-row
                style="width: 98%;"
              >
                <el-table-column label="模块ID" align="center" width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.preConditionBlockID }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="模块名称" width="200" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.preConditionBlockName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="积分" width="80" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.preConditionBlockScore }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="170" class-name="small-padding">
                  <template slot-scope="{row, $index}">
                    <el-button size="mini" type="danger" @click="removePreCondition($index)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="题目列表">
            <div class="choose-problem">
              <span>题目编号</span>
              <el-select v-model="pid" filterable clearable>
                <el-option
                  v-for="item in problemList"
                  :key="item.problemID"
                  :value="item.problemID"
                />
              </el-select>
              <span>积分</span>
              <el-input-number v-model="score" :min="1" />
              <el-button type="primary" @click="addChallengeProblem(pid)">添加题目</el-button>
            </div>
            <div class="problem-list">
              <el-table
                v-loading="listLoading"
                :data="challengeInfo.problems"
                fit
                highlight-current-row
                style="width: 98%;"
              >
                <el-table-column label="顺序" align="center" width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.problemOrder }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="题目ID" width="80" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.problemID }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="标题" width="600" align="center">
                  <template slot-scope="{row}">
                    <el-link type="primary">{{ row.title }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="积分" width="80" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.score }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="170" class-name="small-padding">
                  <template slot-scope="{row, $index}">
                    <el-button size="mini" type="danger" @click="removeChallengeProblem($index)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item class="form-button">
            <el-button type="primary" @click="createChallenge(challengeInfo)">提交</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>

import { fetchChallengeList, createChallenge, fetchChallenge } from '@/api/challenge'
import { fetchProblemList } from '@/api/problems'
import Tinymce from '@/components/Tinymce'
import { updateChallenge } from '../../api/challenge'

export default {
  name: 'UpdateChallenge',
  components: { Tinymce },
  data() {
    return {
      listLoading: '',
      pid: '',
      score: '',
      problemList: null,
      challengeList: null,
      preCondition: {
        preConditionBlockID: '',
        preConditionBlockName: '',
        preConditionBlockScore: ''
      },
      problem: {
        problemOrder: '',
        problemID: '',
        title: '',
        score: ''
      },
      challengeInfo: {
        name: '',
        description: '',
        blockType: '',
        preConditionBlock: [],
        problems: []
      },
      addChallengeRules: {
        name: [
          { required: true, message: '模块名称不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getProblemList()
    this.getChallengeList()
    this.getChallengeDetail()
  },
  methods: {
    getChallengeDetail() {
      const challengeQuery = {
        blockID: this.$route.query.id
      }
      this.listLoading = true
      fetchChallenge(challengeQuery).then(response => {
        const res = response.data
        this.challengeInfo = res.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getProblemList() {
      this.listLoading = true
      fetchProblemList().then(response => {
        const res = response.data
        this.problemList = res.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getChallengeList() {
      this.listLoading = true
      fetchChallengeList().then(response => {
        const res = response.data
        this.challengeList = res.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    addChallengeProblem(pid) { // 添加挑战题目
      var isExist = false
      for (const item of this.challengeInfo.problems) { // 是否存在相同题目
        if (item.problemID === pid) {
          isExist = true
        }
      }
      if (!isExist) {
        for (const item of this.problemList) { // 不存在相同题目则在题目列表中搜索题目
          if (item.problemID === pid) {
            this.problem.problemID = pid
            this.problem.title = item.title // 获取信息
            this.problem.score = this.score
            if (this.challengeInfo.problems.length === 0) { // 是否第一个插入 是就顺序order为1
              this.problem.problemOrder = 1
            } else {
              this.problem.problemOrder = this.challengeInfo.problems[this.challengeInfo.problems.length - 1].problemOrder + 1 // 否则按上一order+1
            }
            const data = Object.assign({}, JSON.parse(JSON.stringify(this.problem))) // 深复制题目信息push到题目列表中
            this.challengeInfo.problems.push(data)
          }
        }
      } else {
        this.$message({
          title: '提示',
          message: '题目已存在',
          type: 'warning',
          duration: 2000
        })
      }
    },
    removeChallengeProblem(index) { // 移除挑战题目
      this.challengeInfo.problems.splice(index, 1)
    },
    addPreCondition(preID, score) { // 添加前置条件
      var isExist = false
      for (const item of this.challengeInfo.preConditionBlock) { // 是否存在相同模块
        if (item.preConditionBlockID === preID) {
          isExist = true
        }
      }
      if (!isExist) {
        for (const item of this.challengeList) { // 不存在相同模块则在模块列表中搜索模块
          if (item.id === preID) {
            this.preCondition.preConditionBlockID = preID
            this.preCondition.preConditionBlockName = item.name // 获取信息
            this.preCondition.preConditionBlockScore = score
            const data = Object.assign({}, JSON.parse(JSON.stringify(this.preCondition))) // 深复制模块信息push到列表中
            this.challengeInfo.preConditionBlock.push(data)
          }
        }
      } else {
        this.$message({
          title: '提示',
          message: '条件已存在',
          type: 'warning',
          duration: 2000
        })
      }
    },
    removePreCondition(index) { // 移除前置条件
      this.challengeInfo.preConditionBlock.splice(index, 1)
    },
    updateChallenge() {
      updateChallenge(this.challengeInfo.id).then(response => {
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
