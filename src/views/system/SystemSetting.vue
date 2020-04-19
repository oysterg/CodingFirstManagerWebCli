<template>
  <div class="app-container">
    <div class="aside warning-title">
      <span>请注意，部分设置仅在重启后生效</span>
    </div>
    <el-card>
      <div slot="header">
        系统设置【全局】
        <el-button type="danger">修改</el-button>
        <el-button type="primary">保存</el-button>
      </div>
      <div>
        <el-row :gutter="5">
          <el-col :span="12">
            系统设置1 ：当前：
            <el-input style="width: 200px" disabled placeholder="当前设置" />可选：
            <el-input style="width: 200px" disabled placeholder="可选设置" />
          </el-col>
          <el-col :span="12">
            系统设置2 ：当前：
            <el-input style="width: 200px" disabled placeholder="当前设置" />可选：
            <el-input style="width: 200px" disabled placeholder="可选设置" />
          </el-col>
          <el-col :span="12">
            系统设置3 ：当前：
            <el-input style="width: 200px" disabled placeholder="当前设置" />可选：
            <el-input style="width: 200px" disabled placeholder="可选设置" />
          </el-col>
          <el-col :span="12">
            系统设置4 ：当前：
            <el-input style="width: 200px" disabled placeholder="当前设置" />可选：
            <el-input style="width: 200px" disabled placeholder="可选设置" />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        系统设置【爬虫模块】
        <el-button type="danger">修改</el-button>
        <el-button type="primary">保存</el-button>
      </div>
      <div>
        <el-row :gutter="5">
          <el-col :span="12">
            系统设置1 ：当前：
            <el-input style="width: 200px" disabled placeholder="当前设置" />可选：
            <el-input style="width: 200px" disabled placeholder="可选设置" />
          </el-col>
          <el-col :span="12">
            系统设置2 ：当前：
            <el-input style="width: 200px" disabled placeholder="当前设置" />可选：
            <el-input style="width: 200px" disabled placeholder="可选设置" />
          </el-col>
          <el-col :span="12">
            系统设置3 ：当前：
            <el-input style="width: 200px" disabled placeholder="当前设置" />可选：
            <el-input style="width: 200px" disabled placeholder="可选设置" />
          </el-col>
          <el-col :span="12">
            系统设置4 ：当前：
            <el-input style="width: 200px" disabled placeholder="当前设置" />可选：
            <el-input style="width: 200px" disabled placeholder="可选设置" />
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {}
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
