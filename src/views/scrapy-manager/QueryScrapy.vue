<template>
  <div class="app-container">
    <el-card>
      <div slot="header">已有爬虫程序</div>
      <div>
        <el-row :gutter="5">
          <el-col v-for="item in scrapys" :key="item" :span="2">
            <ScrapyCard :data="item" />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <div slot="header">爬虫状态</div>
      <div>
        <el-row :gutter="5">
          <el-col :span="6">
            爬虫名:
            <el-input style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            爬虫程序名:
            <el-input style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            目标站点名:
            <el-input style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            站点地址:
            <el-input style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            反反爬措施:
            <el-input style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            部署状态:
            <el-input style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            需要权限:
            <el-input style="width: 200px" disabled />
          </el-col>

          <el-col :span="24">
            当前状态:
            <el-input type="textarea" rows="4" disabled />
          </el-col>
          <el-col :span="24">
            爬虫历史任务:
            <el-input type="textarea" rows="4" disabled />
          </el-col>
        </el-row>
        <el-divider />
        <el-button type="primary">查询</el-button>
        <el-button type="warning">查看该爬虫历史任务</el-button>
        <el-button type="info">查看记录日志</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import ScrapyCard from './components/ScrapyCard'
export default {
  name: 'QueryScrapy',
  components: {
    ScrapyCard
  },
  data() {
    return {
      scrapys: [
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/HDU_icon.png',
          name: 'FullHDU'
        },
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/HDU_icon.png',
          name: 'SpecHDU'
        },
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/ZOJ_favicon.ico',
          name: 'ZOJ1'
        },
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/ZOJ_favicon.ico',
          name: 'ZOJ2'
        },
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/HUST_icon.jpg',
          name: 'HUSTOJ'
        },
        {
          logoUrl: 'https://vjudge.net/static/images/remote_oj/poj.ico',
          name: 'POJ'
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
