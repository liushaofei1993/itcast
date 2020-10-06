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
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="init"
        ></el-button>
      </el-input>
      <el-button type="success" plain @click="addDialogFormVisible = true"
        >添加用户</el-button
      >
    </div>
    <!-- 表格数据展示 -->
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
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
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
            ></el-button>
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
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userObj.pagenum"
      :page-sizes="[1, 2, 3, 5]"
      :page-size="userObj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form
        :model="addForm"
        ref="addForm"
        :label-width="'80px'"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form
        :model="editForm"
        ref="editForm"
        :label-width="'80px'"
        :rules="rules"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" autocomplete="off" disabled style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllUserList, addUser, editUser } from '@/api/user_index.js'
export default {
  data () {
    return {
      // 控制添加用户对话框的显示和隐藏
      addDialogFormVisible: false,
      // 控制编辑用户对话框的显示和隐藏
      editDialogFormVisible: false,
      // 添加用户对应的数据对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户对应的数据对象
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 总记录数
      total: 0,
      // 状态列的状态
      value: true,
      // 参数对象
      userObj: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 用户列表数据数组
      userList: [],
      // 添加表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 添加正则验证规则
          {
            pattern: /\w+[@]\w+[.]\w+/,
            message: '请输入合法的电子邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入合法的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 显示编辑对话框
    showEditDialog (row) {
      this.editDialogFormVisible = true
      // console.log(row)
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    // 编辑用户信息完成时提交
    editSubmit () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          // 验证通过,调用接口方法
          const res = await editUser(this.editForm)
          // console.log(res)
          if (res.data.meta.status === 200) {
            // 编辑成功信息提示
            this.$message({
              type: 'success',
              message: '数据更新成功'
            })
            // 隐藏对话框
            this.editDialogFormVisible = false
            // 重置表单元素数据
            this.$refs.editForm.resetFields()
            // 刷新
            this.init()
          } else {
            // 编辑失败信息提示
            this.$message({
              type: 'error',
              message: res.data.meta.msg
            })
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
    // 添加用户
    addSubmit () {
      // 表单数据的二次验证
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          // 验证通过,调用接口方法
          addUser(this.addForm)
            .then((res) => {
              console.log(res)
              if (res.data.meta.status === 201) {
                // 添加成功信息
                this.$message({
                  type: 'success',
                  message: '数据添加成功'
                })
                // 隐藏对话框
                this.addDialogFormVisible = false
                // 重置表单元素数据
                this.$refs.addForm.resetFields()
                // 刷新
                this.init()
              } else {
                // 添加失败,提示错误信息
                this.$message({
                  type: 'error',
                  message: res.data.meta.msg
                })
              }
            })
            .catch((err) => {
              console.log(err)
              this.$message({
                type: 'error',
                message: '添加用户失败,请再试一次'
              })
            })
        } else {
          this.$message({
            type: 'error',
            message: '数据输入不合法,请重新输入'
          })
          return false
        }
      })
    },
    // 切换每页显示记录数触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      // 修改全局的userObj.pagesize的值为val
      this.userObj.pagesize = val
      // 重新发送(修改后的userObj)请求,获取数据
      this.init()
    },
    // 切换当前页码触发
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      // 修改全局的userObj.pagenum的值为val
      this.userObj.pagenum = val
      // 重新发送(修改后的userObj)请求,获取数据
      this.init()
    },
    // 数据初始化
    init () {
      getAllUserList(this.userObj)
        .then((res) => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            // 获取总记录数
            this.total = res.data.data.total
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
