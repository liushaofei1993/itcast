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
              :model="addForm.goods_cat"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">定时任务补偿</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
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
      cateList: []
    }
  },
  methods: {
    handleClick (v) {
      // console.log(v)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
