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
      <div slot="header">爬虫任务建立</div>
      <div>
        <el-row :gutter="5">
          <el-col :span="24">
            已选爬虫:
            <span style="color: red">（单击上方的爬虫图标选择，双击图标删除）</span>
            <el-input disabled />
          </el-col>

          <el-col :span="8">
            选择任务内容：
            <el-select style="width: 200px" />
          </el-col>
          <el-col :span="12">
            选择执行时间：
            <el-date-picker
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-col>
          <el-col :span="12">
            选择任务名（默认为空则自动分配）：
            <el-input style="width: 200px" />
          </el-col>
          <el-col :span="24">
            已选爬虫的当前状态:
            <el-input type="textarea" rows="4" disabled />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <el-button type="warning">获取已选爬虫的当前状态</el-button>
      <el-button type="primary">设置该任务</el-button>

      <el-button type="info">查看记录日志</el-button>
    </el-card>
    <el-card>
      <div slot="header">已有任务</div>
      <p>AAA - 与2020年4月19日16:53:48执行 - 正在等待</p>
    </el-card>
  </div>
</template>

<script>
import ScrapyCard from './components/ScrapyCard'
export default {
  name: 'SetScrapy',
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
