<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin: 15px 0">
      <el-input
        placeholder="请输入内容"
        v-model="userObj.query"
        class="input-with-select"
        style="width: 300px; margin-right: 10px"
        @keyup.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain>添加用户</el-button>
    </div>
    <!-- 表格数据展示 -->
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="username" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <!-- 添加用户状态列 -->
      <el-table-column label="用户状态" width="70">
        <template slot-scope="">
          <el-switch
            v-model="value"
            active-color="#409eff"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <!-- 添加操作列 -->
      <el-table-column label="操作" width="220">
        <template slot-scope="">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="分配角色"
            placement="top"
          >
            <el-button type="primary" icon="el-icon-rank"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->

  </div>
</template>
<script>
import { getAllUserList } from '@/api/user_index.js'
export default {
  data () {
    return {
      value: true,
      // 参数对象
      userObj: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: []
    }
  },
  methods: {
    // 数据初始化
    init () {
      getAllUserList(this.userObj)
        .then((res) => {
        // console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
