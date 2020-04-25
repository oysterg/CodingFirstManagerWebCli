<template>
  <div id="app-container">
    <div class="challenge-content">
      <el-card class="box-card">
        <el-form ref="challengeInfo" label-positon="left" :rules="addChallengeRules" :model="challengeInfo" label-width="120px">
          <el-form-item label="模块名称" prop="name">
            <el-input v-model="challengeInfo.name" style="width: 1100px" />
          </el-form-item>
          <el-form-item label="描述">
            <div class="text item">
              <Tinymce ref="editor" v-model="challengeInfo.description" :width="1100" :height="400" />
            </div>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="challengeInfo.blockType" placeholder="模块类型">
              <el-option
                v-for="item in blockTypeOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开启条件">
            <span>在模块</span>
            <el-select v-model="precondition.blockId" placeholder="模块" filterable>
              <el-option
                v-for="item in challengeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <span>中获得</span>
            <el-input-number v-model="precondition.num" :min="1" />  积分
            <el-button type="primary" @click="addPreconditionBlock(precondition.blockId, precondition.num)">添加条件</el-button>
            <el-card class="block-list-card">
              <el-table
                v-loading="listLoading"
                :data="challengeInfo.preconditionBlocks"
                fit
                highlight-current-row
                style="width: 98%;"
              >
                <el-table-column label="模块ID" align="center" width="100">
                  <template slot-scope="{row}">
                    <span>{{ row.blockId }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="模块名称" width="640" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="积分" width="100" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.num }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="160" class-name="small-padding">
                  <template slot-scope="{row, $index}">
                    <el-button size="mini" type="danger" @click="removePreconditionBlock($index)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-form-item>
          <el-form-item label="题目列表">
            <div class="choose-problem">
              <span>题目编号</span>
              <el-select v-model="pid" placeholder="题目ID" clearable filterable>
                <el-option
                  v-for="item in problemList"
                  :key="item.problemId"
                  :value="item.problemId"
                />
              </el-select>
              <span>积分</span>
              <el-input-number v-model="score" :min="1" />
              <el-button type="primary" @click="addChallengeProblem(pid)">添加题目</el-button>
            </div>
            <el-card class="problem-list-card">
              <el-table
                v-loading="listLoading"
                :data="challengeInfo.challengeProblems"
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
                    <span>{{ row.problemId }}</span>
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
            </el-card>
          </el-form-item>
          <el-form-item class="form-button">
            <el-button type="primary" @click="updateChallenge">提交</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>

import { fetchAllChallenge, updateChallenge} from '@/api/challenge'
import { fetchAllProblems } from '@/api/problems'
import Tinymce from '@/components/Tinymce'

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
      precondition: {
        blockId: '',
        name: '',
        num: ''
      },
      problem: {
        problemOrder: '',
        problemId: '',
        title: '',
        score: '',
        rewardAcb: 0
      },
      challengeInfo: {
        id: '',
        name: '',
        description: '',
        blockType: '基础',
        preconditionBlocks: [],
        challengeProblems: []
      },
      blockTypeOptions: [
        { name: '基础', value: 0 },
        { name: '数据结构', value: 1 },
        { name: '数学', value: 2 },
        { name: '几何', value: 3 },
        { name: '图论', value: 4 },
        { name: '搜索', value: 5 },
        { name: '动态规划', value: 6 }
      ],
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
    this.challengeInfo = this.$route.query.row
    console.log(this.$route.query.row)
  },
  methods: {
    getProblemList() {
      this.listLoading = true
      fetchAllProblems().then(response => {
        const res = response.data
        this.problemList = res.datas[0]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getChallengeList() {
      this.listLoading = true
      fetchAllChallenge().then(response => {
        const res = response.data
        this.challengeList = res.datas[0]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    addChallengeProblem(pid) { // 添加挑战题目
      var isExist = false
      for (const item of this.challengeInfo.challengeProblems) { // 是否存在相同题目
        if (item.problemId === pid) {
          isExist = true
        }
      }
      if (!isExist) {
        for (const item of this.problemList) { // 不存在相同题目则在题目列表中搜索题目
          if (item.problemId === pid) {
            this.problem.problemId = pid
            this.problem.title = item.title // 获取信息
            this.problem.score = this.score
            if (this.challengeInfo.challengeProblems.length === 0) { // 是否第一个插入 是就顺序order为1
              this.problem.problemOrder = 1
            } else {
              this.problem.problemOrder = this.challengeInfo.challengeProblems[this.challengeInfo.challengeProblems.length - 1].problemOrder + 1 // 否则按上一order+1
            }
            const data = Object.assign({}, JSON.parse(JSON.stringify(this.problem))) // 深复制题目信息push到题目列表中
            this.challengeInfo.challengeProblems.push(data)
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
      this.challengeInfo.challengeProblems.splice(index, 1)
    },
    addPreconditionBlock(preId, score) { // 添加前置条件
      var isExist = false
      for (const item of this.challengeInfo.preconditionBlocks) { // 是否存在相同模块
        if (item.blockId === preId) {
          isExist = true
        }
      }
      console.log(this.precondition)
      if (!isExist) {
        for (const item of this.challengeList) { // 不存在相同模块则在模块列表中搜索模块
          if (item.id === preId) {
            this.precondition.blockId = preId
            this.precondition.name = item.name // 获取信息
            this.precondition.num = score
            console.log(this.precondition)
            const data = Object.assign({}, JSON.parse(JSON.stringify(this.precondition))) // 深复制模块信息push到列表中
            this.challengeInfo.preconditionBlocks.push(data)
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
    removePreconditionBlock(index) { // 移除前置条件
      this.challengeInfo.preconditionBlocks.splice(index, 1)
    },
    updateChallenge() {
      this.$refs.challengeInfo.validate(valid => {
        if (valid) {
          this.listLoading = true
          updateChallenge(this.challengeInfo).then(response => {
            const res = response.data
            if (res.code === 10000) {
              this.$message({
                title: '成功',
                message: '修改成',
                type: 'success',
                duration: 2000
              })
            }
            this.goBack()
          })
        } else {
          this.$message({
            title: '错误',
            message: '提交错误',
            type: 'fail',
            duration: 2000
          })
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
  .block-list-card, .problem-list-card {
    width: 1100px;
    margin-top: 30px;
  }
</style>
