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
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
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
          <el-form-item
            :label="first.attr_name"
            v-for="first in cateParamsDynamic"
            :key="first.attr_id"
          >
            <!-- 如果v-model绑定了一个公共数组cateCheckList,那么当有多组复选框时,会造成多组复选框都指向同一个数组,同时会造成只有最后一组数据,大麻烦啊!所以我们要为每一组绑定一个独立的数据成员,而循环的数据体first中有一个属性attr_vals,他是每一个对象中特有的数组,绑定它就可以实现: 取消勾选多选框可以影响到数据体first的属性attr_vals数组的数据.  然而需要注意的是checkbox中的checked属性会勾选中复选框,与group中的v-model属性相冲突,会造成绑定的值为true,取消checked属性即可 -->
            <el-checkbox-group v-model="first.attr_vals">
              <el-checkbox
                :label="second"
                v-for="(second, index) in first.attr_vals"
                :key="index"
                border
              ></el-checkbox
              >\
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item
            label-width="150px"
            :label="item.attr_name"
            v-for="item in cateParamsStatic"
            :key="item.attr_id"
          >
            <el-input :value="item.attr_vals" readonly></el-input>
          </el-form-item>
        </el-tab-pane>
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
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor
            class="myquill"
            v-model="addForm.goods_introduce"
          ></quill-editor>
        </el-tab-pane>
      </el-tabs>
      <el-button type="primary" plain class="fr" @click="addGoods"
        >添加商品</el-button
      >
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
import { addGoods } from '@/api/goods_index.js'
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
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
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
      } else if (file.size >= 500 * 1024) {
        this.$message.error('图片过大,请换一张')
        return false
      }
    },
    // 添加商品
    async addGoods () {
      // console.log(this.addForm)
      // console.log(this.cateParamsDynamic)
      // 判断商品信息必填项是否填写
      if (
        this.addForm.goods_name === '' ||
        this.addForm.goods_price === '' ||
        this.addForm.goods_number === '' ||
        this.addForm.goods_weight === ''
      ) {
        this.$message.error('请输入完整的商品信息')
        return
      }
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择三级分类,一级或二级都不可以哦')
        return
      }
      // 搜集attrs数据
      // 遍历动态参数cateParamsDynamic,将attr_id和attr_value的值添加到addForm.attrs中
      for (var i = 0; i < this.cateParamsDynamic.length; i++) {
        var id = this.cateParamsDynamic[i].attr_id
        for (var j = 0; j < this.cateParamsDynamic[i].attr_vals.length; j++) {
          this.addForm.attrs.push({
            attr_id: id,
            attr_value: this.cateParamsDynamic[i].attr_vals[j]
          })
        }
      }
      // 对参数addForm.goods_cat进行处理: 转成以,分割的字符串
      this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      console.log(this.addForm)
      // 添加商品
      const res = await addGoods(this.addForm)
      // console.log(res)
      if (res.data.meta.status === 201) {
        // 提示
        this.$message.success(res.data.meta.msg)
        // 清空(此处无效,可能是因为el-form中使用了标签页包裹el-form-item吧)
        this.$refs.addForm.resetFields()
        // 跳转
        this.$router.push({ name: 'list' })
      }
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
          const res = await getAllCateParamsList(
            this.addForm.goods_cat.slice(-1),
            'many'
          )
          console.log(res)
          // 判断res.data.data是否有数据
          if (res.data.data.length === 0) {
            this.$message.warning('当前分类没有商品参数')
            this.cateParamsDynamic = []
            return
          }
          this.cateParamsDynamic = res.data.data
          // console.log(this.cateParamsDynamic[0].attr_vals)
          this.cateParamsDynamic.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            // item.attr_vals = [...item.attr_vals]
            // console.log(item.attr_vals instanceof Array)
          })
          // console.log(this.cateParamsDynamic[0].attr_vals)
        } else {
          // 如果是2,就获取静态参数
          const res = await getAllCateParamsList(
            this.addForm.goods_cat.slice(-1),
            'only'
          )
          console.log(res)
          // 判断res.data.data是否有数据
          if (res.data.data.length === 0) {
            this.$message.warning('当前分类没有商品属性')
          }
          this.cateParamsStatic = res.data.data
        }
      }
    }
  },
  mounted () {
    getAllCateList([1, 2, 3])
      .then((res) => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.cateList = res.data.data
        }
      })
      .catch((err) => {
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
