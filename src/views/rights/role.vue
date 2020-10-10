<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <div style="margin: 15px 0">
      <el-button type="primary" plain @click="addDialogFormVisible = true"
        >添加角色</el-button
      >
    </div>
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
            style="margin-bottom: 10px; border-bottom: 1px dashed #ccc"
          >
            <el-col :span="4">
              <el-tag
                closable
                type="success"
                @close="delRightsById(scope.row, first.id)"
              >
                {{ first.authName }}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <el-row
                :gutter="60"
                v-for="second in first.children"
                :key="second.id"
                style="margin-bottom: 10px"
              >
                <el-col :span="4">
                  <el-tag
                    closable
                    type="info"
                    @close="delRightsById(scope.row, second.id)"
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
                    @close="delRightsById(scope.row, thirdly.id)"
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
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
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
              @click="showGrantDialog(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权对话框 -->
    <el-dialog title="角色授权" :visible.sync="grantDialogFormVisible">
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkArr"
        :props="defaultProps"
        ref="tree"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantSubmit">确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addRoleForm" :rules = "rules" ref="addRoleForm" :label-width="'80px'">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllRoleList,
  delRightsByRoleId,
  grantRightsById,
  addRole
} from '@/api/role_index.js'
import { getAllRightsList } from '@/api/rights_index.js'
export default {
  data () {
    return {
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addDialogFormVisible: false,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      roleId: '',
      grantDialogFormVisible: false,
      roleList: [],
      rightsList: [],
      checkArr: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    // 实现角色的添加
    addRoleSubmit (addRoleForm) {
      this.$refs.addRoleForm.validate(async valid => {
        if (valid) {
          // 调用接口方法添加角色数据
          const res = await addRole(this.addRoleForm)
          console.log(res)
          if (res.data.meta.status === 201) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.addDialogFormVisible = false
            this.roleListInit()
          }
        } else {
          this.$message({
            type: 'error',
            message: '数据输入不合法,请重新输入'
          })
          return false
        }
      })
    },
    // 实现角色授权的提交
    async grantSubmit () {
      // var obj = this.$refs.tree.getCheckedKeys()
      var arr = this.$refs.tree.getCheckedNodes()
      // var arr = this.$refs.tree.getHalfCheckedKeys()
      console.log(arr)
      // 我们有什么: arr:[{id:109,pid:'107,102'},{id:154,pid:'107,102'}]
      // 1.遍历数组arr,进行数据的拼接
      // 创建临时数组
      var temp = []
      arr.forEach((item) => {
        temp.push(item.id + ',' + item.pid)
      })
      // console.log(temp) // ['109,107,102','154,107,102']
      // 2.将数组拼接成字符串
      var tempstr = temp.join(',')
      // console.log(tempstr) // '109,107,102,154,107,102'
      // 3.将字符串分列成数组
      var temparr = tempstr.split(',')
      // console.log(temparr) // [109,107,102,154,107,102]
      // 4.数组去重
      var finalarr = [...new Set(temparr)]
      // console.log(finalarr) // ["102","107","109","154"]
      // 我们要什么: '102,107,109,154'

      // 调用接口方法实现角色权限的分配
      const res = await grantRightsById(this.roleId, finalarr.join(','))
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        this.grantDialogFormVisible = false
        this.roleListInit()
      }
    },
    // 展示授权对话框
    async showGrantDialog (row) {
      // 获取角色id,方便后期的角色分配提交时的参数获取
      this.roleId = row.id
      this.grantDialogFormVisible = true
      // 获取权限列表数据
      const res = await getAllRightsList('tree')
      // console.log(res)
      this.rightsList = res.data.data
      console.log(row)
      // 树状组件默认选中: 通过添加三级权限id到数组checkArr中
      // 添加三级权限到id数组checkArr之前,要先清空数组,否则删除了权限,打开树状组件时,删除的权限默认还是会选中
      this.checkArr.length = 0
      // 判断是否有children属性且children数组是否有数据
      if (row.children && row.children.length > 0) {
        row.children.forEach((first) => {
          if (first.children && first.children.length > 0) {
            first.children.forEach((second) => {
              if (second.children && second.children.length > 0) {
                second.children.forEach((thirdly) => {
                  // 添加id到数组
                  this.checkArr.push(thirdly.id)
                })
              }
            })
          }
        })
      }
    },
    // 删除指定角色的指定权限
    async delRightsById (row, rightsId) {
      // console.log(roleId, rightsId)
      const res = await delRightsByRoleId(row.id, rightsId)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        // console.log(res)
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
