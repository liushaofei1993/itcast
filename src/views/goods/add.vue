<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="activeName - 0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 添加表单 -->
    <el-form :model="addForm" ref="addForm" label-width="120px">
      <!-- 标签页 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        tab-position="left"
        style="margin-top: 20px"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="cateList"
              clearable
              v-model="addForm.goods_cat"
              :props="cateprops"
              @change="cateSelect"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :headers="getToken()"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
      </el-tabs>
      <el-button type="primary" plain class="fr" @click="addGoods">添加商品</el-button>
    </el-form>
  </div>
</template>
<script>
import { getAllCateList } from '@/api/cate_index.js'
export default {
  data () {
    return {
      // 上传文件的列表
      fileList: [],
      activeName: '0',
      addForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      cateList: [],
      cateprops: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  methods: {
    // 添加商品
    addGoods () {
      console.log(this.addForm.pics)
    },
    // 设置上传的请求头,为方便扩展,使用函数返回对象的形式
    getToken () {
      var token = localStorage.getItem('itcast_manage_token')
      return { Authorization: token }
    },
    // 文件上传成功时触发的钩子函数
    handleSuccess (response, file, fileList) {
      console.log(response)
      if (response.meta.status === 200) {
        // 我们需要的上传成功的文件数据就在response中,我们要将上传成功后的文件路径(相对路径)存储到addForm的pics中
        this.addForm.pics.push({ pic: response.data.tmp_path })
      }
    },
    // 文件移除的时候触发
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    // 文件预览的时候触发
    handlePreview (file) {
      console.log(file)
    },
    cateSelect (obj) {
      console.log(obj)
      console.log(this.addForm.goods_cat.join(','))
    },
    handleClick (v) {
      // console.log(v)
    }
  },
  mounted () {
    getAllCateList([1, 2, 3])
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.cateList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
</style>
