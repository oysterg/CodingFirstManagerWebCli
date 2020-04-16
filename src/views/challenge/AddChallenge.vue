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
            <el-input-number v-model="preCondition.score" :min="0" />  积分
          </el-form-item>
          <el-form-item label="题目列表">
            <div class="choose-problem">
              <span>题目编号</span>
              <el-select v-model="problem.problemID" filterable clearable>
                <el-option
                  v-for="item in problemList"
                  :key="item.problemID"
                  :value="item.problemID"
                />
              </el-select>
              <span>积分</span>
              <el-input-number v-model="problem.score" :min="0" />
              <el-button type="primary" @click="addChallengeProblem(problem.problemID)">添加题目</el-button>
            </div>
            <div class="problem-list">
              <el-table
                v-loading="listLoading"
                :data="challengeInfo.problems"
                fit
                highlight-current-row
                style="width: 98%;"
              >
                <el-table-column label="顺序" prop="id" sortable="custom" align="center" width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.order }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="题目ID" width="80" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.problemID }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="标题" width="200" align="center">
                  <template slot-scope="{row}">
                    <el-link type="primary">{{ row.title }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="积分" width="80" align="center">
                  <template slot-scope="{row}">
                    <el-link type="primary">{{ row.score }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="170" class-name="small-padding">
                  <template slot-scope="{row,$index}">
                    <el-button size="mini" type="danger" @click="currentRow = row, currentIndex = $index, dialogVisible = true">删除
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

import { fetchChallengeList, createChallenge } from '@/api/challenge'
import { fetchProblemList } from '@/api/problems'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'AddChallenge',
  components: { Tinymce },
  data() {
    return {
      listLoading: '',
      problemOrderBefore: undefined,
      problemList: '',
      challengeList: '',
      preCondition: {
        preConditionBlockID: '',
        preConditionBlockScore: '0'
      },
      problem: {
        order: '',
        problemID: '',
        title: '',
        score: '0'
      },
      challengeInfo: {
        name: '',
        description: '',
        blockType: '',
        preConditionBlock: [],
        problems: []
      },
      addChallengeRules: {
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
    this.getChallenges()
  },
  methods: {
    getProblemList() {
      this.listLoading = true
      const problemsQuery = {
        page: 1,
        sort: '+id'
      }
      fetchProblemList(problemsQuery).then(response => {
        const res = response.data
        this.problemList = res.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getChallenges() {
      this.listLoading = true
      const challengeQuery = {
        page: 1,
        sort: '+id'
      }
      fetchChallengeList(challengeQuery).then(response => {
        const res = response.data
        this.challengeList = res.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    addChallengeProblem(problemID) {
      for (const item of this.problemList) {
        if (item.problemID === problemID) {
          this.problem.name = item.name
        }
      }
      if (this.challengeInfo.problems.length === 0) {
        this.problem.order = 1
      } else {
        this.problem.order = this.challengeInfo.problems[this.challengeInfo.problems.length - 1].order + 1
      }
      console.log(this.challengeInfo.problems)
      this.challengeInfo.problems.push(this.problem)
    },
    createContest() {
      this.$refs.challengeInfo.validate(valid => {
        if (valid) {
          this.listLoading = true
          createChallenge(this.challengeInfo).then(response => {
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
