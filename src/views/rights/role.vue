<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格数据展示 -->
    <el-table :data="roleList" style="width: 100%" border>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称">
      </el-table-column>
      <el-table-column prop="roleDesc" label="描述"> </el-table-column>
      <!-- 添加操作列 -->
      <el-table-column label="操作">
        <template slot-scope="">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="角色授权"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-rank"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="primary"
              icon="el-icon-delete"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRoleList } from '@/api/role_index.js'
export default {
  data () {
    return {
      roleList: []
    }
  },
  methods: {
    // 角色列表数据初始化
    async roleListInit () {
      const res = await getAllRoleList()
      console.log(res)
      if (res.data.meta.status === 200) {
        this.roleList = res.data.data
      }
    }
  },
  mounted () {
    this.roleListInit()
  }
}
</script>
<style lang="less" scoped>
</style>
