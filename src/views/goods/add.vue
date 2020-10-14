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
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="first.attr_name" v-for="first in cateParamsDynamic" :key="first.attr_id">
            <el-checkbox-group v-model="cateCheckList">
              <el-checkbox :label="second" v-for="(second, index) in first.attr_vals" :key="index" border checked></el-checkbox>\
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :headers="getToken()"
            :before-upload="handleBefore"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
         <quill-editor class="myquill" v-model="addForm.goods_introduce"></quill-editor>
        </el-tab-pane>
      </el-tabs>
      <el-button type="primary" plain class="fr" @click="addGoods">添加商品</el-button>
    </el-form>
  </div>
</template>
<script>
// 先下载  npm i vue-quill-editor --save
// 再引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引模块
import { quillEditor } from 'vue-quill-editor'
import { getAllCateList } from '@/api/cate_index.js'
import { getAllCateParamsList } from '@/api/cate_params.js'
export default {
  components: {
    quillEditor
  },
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
      cateCheckList: [],
      cateParamsDynamic: [], // 动态参数
      cateParamsStatic: [], // 静态参数
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
    // 文件上传之前的钩子,可以对上传文件进行合法性判断
    // file就是你当前所选择的文件对象
    handleBefore (file) {
      console.log(file)
      if (file.type.indexOf('image/') !== 0) {
        this.$message.error('请上传图片')
        return false // 这一步会触发handleRemove,所以在handleRemove里面需要判断file.response
      } else if (file.size >= (500 * 1024)) {
        this.$message.error('图片过大,请换一张')
        return false
      }
    },
    // 添加商品
    addGoods () {
      console.log(this.addForm)
    },
    // 设置上传的请求头,为方便扩展,使用函数返回对象的形式
    getToken () {
      var token = localStorage.getItem('itcast_manage_token')
      return { Authorization: token }
    },
    // 文件上传成功时触发的钩子函数
    handleSuccess (response) {
      console.log(response)
      if (response.meta.status === 200) {
        // 我们需要的上传成功的文件数据就在response中,我们要将上传成功后的文件路径(相对路径)存储到addForm的pics中
        this.addForm.pics.push({ pic: response.data.tmp_path })
      }
    },
    // 文件移除的时候触发
    handleRemove (file, fileList) {
      // file就是用户当前删除的图片对象
      console.log(file)
      // 判断当上传文件类型不正确时,没有file.response,就不向下执行
      if (!file.response) {
        return
      }
      // 存储当前移除的文件的路径
      var current = file.response.data.tmp_path
      // 遍历数组pics,找到与移除文件路径相同的对象,删除它,实现添加商品时正确的上传文件的数量
      for (var i = 0; i < this.addForm.pics.length; i++) {
        if (this.addForm.pics[i].pic === current) {
          this.addForm.pics.splice(i, 1)
          break // 添加break可以实现: 在数组pics中遍历到移除的文件了,删除后就不再向下遍历了
        }
      }
    },
    // 文件预览的时候触发
    handlePreview (file) {
      console.log(file)
    },
    cateSelect (obj) {
      console.log(obj)
      console.log(this.addForm.goods_cat.join(','))
    },
    // 点击标签页触发
    async handleClick () {
      // 判断当标签页的商品参数或商品属性被选中时才向下执行
      if (this.activeName === '1' || this.activeName === '2') {
        // 判断基本信息中商品分类是否已选定
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.warning('请选择基本信息中的商品分类')
          return
        }
        // 如果是1,就获取动态参数
        if (this.activeName === '1') {
          var res = await getAllCateParamsList(this.addForm.goods_cat.slice(-1), 'many')
          console.log(res)
          // 判断res.data.data是否有数据
          if (res.data.data.length === 0) {
            this.$message.warning('当前分类没有商品参数')
            this.cateParamsDynamic = []
            return
          }
          this.cateParamsDynamic = res.data.data
          // console.log(this.cateParamsDynamic[0].attr_vals)
          this.cateParamsDynamic.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          })
          console.log(this.cateParamsDynamic[0].attr_vals)
        } else { // 如果是2,就获取静态参数

        }
      }
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
.myquill {
  // height: 400px;
  border-bottom: 1px solid #ccc;
  // overflow: scroll;
}
</style>
