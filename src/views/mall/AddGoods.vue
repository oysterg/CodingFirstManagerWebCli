<template>
  <div id="app-container">
    <div class="goods-content">
      <el-card class="box-card">
        <el-form ref="goodsInfo" :rules="addGoodsRules" :model="goodsInfo" label-width="80px">
          <el-form-item label="商品ID" prop="goodsID">
            <el-input v-model="goodsInfo.goodsID" />
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="goodsInfo.name" />
          </el-form-item>
          <el-form-item label="ACB">
            <el-input-number v-model="goodsInfo.cost" :min="1" />
          </el-form-item>
          <el-form-item label="库存数量">
            <el-input-number v-model="goodsInfo.stock" :min="1" />
          </el-form-item>
          <el-form-item label="限购数量">
            <el-input-number v-model="goodsInfo.buyLimit" :min="1" />
          </el-form-item>
          <el-form-item label="认证限购">
            <el-select v-model="goodsInfo.buyVerifyLimit">
              <el-option value="所有人均可购买" />
              <el-option value="校内人员可购买" />
              <el-option value="协会成员可购买" />
              <el-option value="现役人员可购买" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-switch
              v-model="goodsInfo.visible"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="商品封面">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              limit="1"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="pictureDialogVisible">
              <img width="100%" :src="goodsInfo.pictureUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="商品描述">
            <div class="text item">
              <Tinymce ref="editor" v-model="goodsInfo.description" :height="400" />
            </div>
          </el-form-item>
          <el-form-item class="form-button">
            <el-button type="primary" @click="ceateGoods(goodsInfo)">提交</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>>
    </div>
  </div>
</template>

<script>

import { createGoods } from '@/api/mall'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'AddGoods',
  components: { Tinymce },
  data() {
    return {
      pictureDialogVisible: false,
      uploadVisible: true,
      goodsInfo: {
        goodsID: '',
        name: '',
        cost: '',
        stock: '',
        buyLimit: '',
        buyVerifyLimit: '所有人均可购买',
        visible: '',
        pictureUrl: '',
        description: ''
      },
      addGoodsRules: {
        goodsID: [
          { required: true, message: '商品ID不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    ceateGoods() {
      this.$refs.goodsInfo.validate(valid => {
        if (valid) {
          this.listLoading = true
          createGoods(this.goodsInfo).then(response => {
            const res = response.data
            if (res.code === 10000) {
              this.$message({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            }
            this.goBack()
          })
        } else {
          return false
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.goodsInfo.pictureUrl = file.url
      this.pictureDialogVisible = true
    },
    beforePictureUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isJPG && !isPNG) {
        this.$message.error('只能上传JPG或PNG格式的图片')
      }
      return isJPG && isPNG
    },
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .goods-content {
    width: 1000px;
    margin-top: 30px;
    margin-left: 30px;
  }
  .box-card {
    width: 1400px;
    margin-top: 30px;
    margin-left: 30px;
  }
  .form-button {
    float: right;
  }
</style>
