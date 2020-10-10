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
      <!-- type: expand --说明这一列的内容在后期可以展开或合并
      这列的template结构就是展开行的内容 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 循环嵌套生成展开行数据展示结构 -->
          <el-row
            :gutter="40"
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom: 10px;border-bottom: 1px dashed #ccc"
          >
            <el-col :span="4">
              <el-tag
                closable
                type="success"
                @close="delRightsById(scope.row,first.id)"
              >
                {{ first.authName }}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <el-row :gutter="60" v-for="second in first.children" :key="second.id" style="margin-bottom: 10px">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="info"
                    @close="delRightsById(scope.row,second.id)"
                    >
                      {{ second.authName }}
                  </el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    v-for="thirdly in second.children"
                    :key="thirdly.id"
                    closable
                    type="warning"
                    style="margin: 0px 10px 5px 0px"
                    @close="delRightsById(scope.row,thirdly.id)"
                    >
                      {{ thirdly.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length == 0">
              没有任何权限,请先分配
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="roleDesc" label="描述"> </el-table-column>
      <!-- 添加操作列 -->
      <el-table-column label="操作">
        <template slot-scope="">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="角色授权"
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
  </div>
</template>
<script>
import { getAllRoleList, delRightsByRoleId } from '@/api/role_index.js'
export default {
  data () {
    return {
      roleList: []
    }
  },
  methods: {
    // 删除指定角色的指定权限
    async delRightsById (row, rightsId) {
      // console.log(roleId, rightsId)
      const res = await delRightsByRoleId(row.id, rightsId)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        console.log(res)
        // this.roleListInit() // 绝对不允许刷新整个表格的数据，因为这样不利于用户体验
        row.children = res.data.data
      }
    },
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
<style lang="less" scoped></style>
