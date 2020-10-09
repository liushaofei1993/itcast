<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-table
      ref="singleTable"
      :data="rightsList"
      style="width: 500px"
      border
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180">
      </el-table-column>
      <el-table-column prop="" label="层级">
        <template slot-scope="scope">
          {{scope.row.level | levelFormat}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRightsList } from '@/api/rights_index.js'
export default {
  data () {
    return {
      rightsList: []
    }
  },
  // 添加过滤器
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      } else {
        return ''
      }
    }
  },
  mounted () {
    getAllRightsList('list')
      .then(res => {
        console.log(res)
        this.rightsList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
</style>
