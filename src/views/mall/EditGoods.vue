<template>
  <div id="app-container">
    <div class="goods-content">
      <el-form ref="goodsInfo" :rules="editGoodsRules" :model="goodsInfo" label-width="80px">
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
            class="picture-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handlePictureUpload"
            :on-remove="handleRemove"
            :before-upload="beforePictureUpload"
          >
            <img v-if="goodsInfo.pictureUrl" :src="goodsInfo.pictureUrl" class="goods-cover">
            <span v-if="goodsInfo.pictureUrl" class="el-upload-action" @click.stop="handleRemove()">
              <i class="el-icon-delete"></i>
            </span>
            <i v-else class="el-icon-upload2 picture-uploader-icon" stop></i>
          </el-upload>

        </el-form-item>
        <el-form-item label="商品描述">
          <div class="text item">
            <Tinymce ref="editor" v-model="goodsInfo.description" :height="400" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateGoods(goodsInfo)">提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { updateGoods, fetchGoods } from '@/api/mall'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'EditGoods',
  components: { Tinymce },
  data() {
    return {
      pictureDialogVisible: false,
      goodsInfo: {
        id: '',
        goodsID: '',
        name: '',
        cost: '',
        stock: '',
        buyLimit: '',
        buyVerifyLimit: '',
        visible: '',
        pictureUrl: '',
        description: ''
      },
      editGoodsRules: {
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getGoodsDetail()
  },
  methods: {
    getGoodsDetail() {
      this.listLoading = true
      const id = this.$route.query.id
      fetchGoods(id).then(response => {
        const res = response.data
        this.goodsInfo = res.data
        if (res.data.visible === '1') {
          this.goodsInfo.visible = true
        } else {
          this.goodsInfo.visible = false
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    updateGoods() {
      this.$refs.goodsInfo.validate(valid => {
        if (valid) {
          this.listLoading = true
          updateGoods(this.goodsInfo).then(response => {
            const res = response.data
            if (res.code === 10000) {
              this.$message({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.go(-1)
          })
        } else {
          console.log('提交错误!!')
          return false
        }
      })
    },
    handleRemove() {
      this.goodsInfo.pictureUrl = ''
    },
    handlePictureUpload(res, file) {
      this.goodsInfo.pictureUrl = res.data.url
    },
    beforePictureUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isJPG && !isPNG) {
        this.$message.error('只能上传JPG或PNG格式的图片')
      }
      return isJPG && isPNG
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
  .picture-uploader{
    width: 120PX;
    height: 120px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .picture-uploader-icon{
  font-size: 0;
  color: #fff;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  }
  .picture-uploader-icon:hover{
  font-size: 28px;
  background-color: rgba(0, 0, 0, .3);
  }
  .goods-cover {
  position: relative;
  width: 120px;
  height: 120px;
  display: block;
  }
  .el-upload-action {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 0;
    color: #fff;
    text-align: center;
    line-height: 120px;
  }
  .el-upload-action:hover {
    font-size: 20px;
    background-color: #000;
    background-color: rgba(0, 0, 0, .3)
  }
</style>
