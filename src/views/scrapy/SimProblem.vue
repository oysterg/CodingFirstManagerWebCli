<template>
  <div class="app-container">
    <div class="aside warning-title">
      <span>请注意，爬取题目时已经保证了题目的唯一性，这里进行的查重是对题目题干进行相似度查重</span>
    </div>

    <el-row :gutter="10">
      <el-col v-for="item in twoProblems" :key="item" :span="12">
        <el-card>
          <div slot="header">
            {{ item.cardName }}
            <span
              v-if="item.canBeAll"
              style="color: red"
            >（可选择题目来源库的全部题目！数据库题号项填入“all”）</span>
          </div>
          <div>
            <el-row :gutter="5">
              <el-col :span="8">
                题目来源库：
                <el-select style="width: 180px" placeholder="题目来源库" />
              </el-col>
              <el-col :span="8">
                数据库题号：
                <el-input style="width: 180px" placeholder="数据库题号" />
              </el-col>
              <el-col :span="8">
                是否已进入本地题库：
                <el-input style="width: 180px" disabled />
              </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="5">
              <el-col :span="12">
                来源站点：
                <el-select style="width: 200px" disabled />
              </el-col>
              <el-col :span="12">
                源题号：
                <el-input style="width: 200px" disabled />
              </el-col>
              <el-col :span="24">
                题目标题：
                <el-input style="width: 500px" disabled />
              </el-col>
              <el-col :span="24">
                题目描述：
                <span style="color: red">（相似度主要针对该项进行检测）</span>
                <el-input type="textarea" :rows="4" disabled />
              </el-col>
              <el-col :span="24">
                输入描述：
                <span style="color: red">（该项作为参考）</span>
                <el-input type="textarea" :rows="4" disabled />
              </el-col>
              <el-col :span="24">
                输入样例：
                <span style="color: red">（该项作为参考）</span>
                <el-input type="textarea" :rows="4" disabled />
              </el-col>
              <el-col :span="24">
                输出描述：
                <span style="color: red">（该项作为参考）</span>
                <el-input type="textarea" :rows="4" disabled />
              </el-col>
              <el-col :span="24">
                输出样例：
                <span style="color: red">（该项作为参考）</span>
                <el-input type="textarea" :rows="4" disabled />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card>
      <el-button type="warning">预先简单查重</el-button>
      <el-button type="primary">开始查重</el-button>
      <el-button type="danger">本地化题目</el-button>
    </el-card>
    <el-card>
      <div slot="header">查重结果</div>

      <span style="color: red">本次任务未开始</span>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SimProblem',
  data() {
    return {
      twoProblems: [
        {
          cardName: '题目1',
          canBeAll: false,
          data: ''
        },
        {
          cardName: '题目2',
          canBeAll: true,
          data: ''
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .warning-title {
    background-color: lightyellow;
    color: red;
  }
  & >>> .el-card__header {
    background-color: #eef1f6;
  }
  .el-card {
    margin-bottom: 14px;
    >>> .el-col {
      margin-bottom: 10px;
    }
  }
}
</style>
