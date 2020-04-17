<template>
  <div class="app-container">
    <div class="aside warning-title">
      <span>请注意，如非必要，请尽量在网络空闲时期爬取题目。如需设置自动爬取策略，请到爬虫管理模块设置</span>
    </div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <div slot="header">全站爬取</div>
          <div>
            <el-row :gutter="5">
              <el-col v-for="item in fullOjs" :key="item" :span="4">
                <OJSiteCard :data="item" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">范围爬取</div>
          <div>
            <el-row :gutter="5">
              <el-col v-for="item in specOjs" :key="item" :span="4">
                <OJSiteCard :data="item" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card>
      <div>
        <el-row :gutter="5">
          <el-col :span="6">
            爬取站点:
            <el-input style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            站点网址:
            <el-input style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            执行爬虫:
            <el-input style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            执行权限:
            <el-input style="width: 200px" disabled />
          </el-col>
          <el-col :span="24">
            爬取范围：
            <el-input />
            <span
              style="color: red"
            >接收参数：单题直接输入题号，范围使用“[起始题号-结束题号]”（范围仅支持数字题号），用“,”隔开。例：1000,1001,[1002-1009],1010</span>
          </el-col>
          <el-button type="warning">检查爬取站点网络状态</el-button>
          <el-button type="warning">检查爬取范围有效性</el-button>
          <el-button type="primary">开始爬取</el-button>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <div slot="header">执行结果</div>
      <span style="color: red">本次任务未开始</span>
    </el-card>
  </div>
</template>

<script>
import OJSiteCard from './components/OJSiteCard'
export default {
  name: 'GetProblems',
  components: {
    OJSiteCard
  },
  data() {
    return {
      fullOjs: [
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/HDU_icon.png',
          name: 'HDU'
        },
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/ZOJ_favicon.ico',
          name: 'ZOJ'
        },
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/HUST_icon.jpg',
          name: 'HUSTOJ'
        },
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/poj.ico',
          name: 'POJ'
        }
      ],
      specOjs: [
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/HDU_icon.png',
          name: 'HDU'
        },
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/ZOJ_favicon.ico',
          name: 'ZOJ'
        },
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/HUST_icon.jpg',
          name: 'HUSTOJ'
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

