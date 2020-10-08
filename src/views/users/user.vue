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
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#409eff"
            inactive-color="#dcdfe6"
            @change="changeState(scope.row.id, scope.row.mg_state)"
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
            <el-button type="primary" icon="el-icon-rank" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="primary"
              icon="el-icon-delete"
              @click="del(scope.row.id)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userObj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
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
          <el-input
            v-model="editForm.username"
            autocomplete="off"
            disabled
            style="width: 100px"
          ></el-input>
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
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
      <el-form
        :model="grantForm"
        ref="grantForm"
        :label-width="'80px'"
        :rules="rules"
      >
        <el-form-item label="用户名:">
          <span>{{ grantForm.username }}</span>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="grantForm.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllUserList,
  addUser,
  editUser,
  delUserById,
  updateUserState,
  grantUserRole
} from '@/api/user_index.js'
import { getAllRoleList } from '@/api/role_index.js'
export default {
  data () {
    return {
      // 角色列表数据
      roleList: [],
      // 分配角色对应的数据对象
      grantForm: {
        id: '',
        rid: '',
        username: ''
      },
      // 控制分配角色对话框的显示和隐藏
      grantDialogFormVisible: false,
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
      // 参数对象
      userObj: {
        query: '',
        pagenum: 1,
        pagesize: 4
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
    // 给用户分配角色
    async grantRole () {
      console.log(this.grantForm)
      // 判断一下是否选择了一个角色
      if (!this.grantForm.rid) {
        this.$message({
          type: 'warning',
          message: '请选择一个角色'
        })
      } else {
        const res = await grantUserRole(this.grantForm)
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '角色设置成功'
          })
          // 隐藏对话框
          this.grantDialogFormVisible = false
          // 刷新页面:(分配角色默认展示信息是来源于自定义模板的scope.row,
          // 分配角色完成不刷新,scope.row数据也不会刷新,那么角色默认展示信息是分配前的,而不是分配后的)
          this.init()
        }
      }
    },
    // 展示分配角色对话框
    showGrantDialog (row) {
      console.log(row)
      this.grantDialogFormVisible = true
      this.grantForm.username = row.username
      this.grantForm.id = row.id
      this.grantForm.rid = row.rid
    },
    // 修改用户状态
    async changeState (id, type) {
      // console.log(id, type)
      // 调用方法获取操作结果
      const res = await updateUserState(id, type)
      // console.log(res)
      // 对结果进行处理
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '状态修改成功'
        })
      }
    },
    // 通过id删除用户
    del (id) {
      this.$confirm(
        `此操作将永久删除id号为${id}的文件, 是否继续?`,
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          delUserById(id)
            .then((res2) => {
              // console.log(res2)
              if (res2.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                // 如果代码到了这一步，说明这条记录已经删除了，只是还没有刷新

                // 在删除之后刷新之前,进行判断,是因为: 刷新之后修改当前页码的值就晚了

                // (只有在刷新之后,总记录数total才会重新赋值,与实际记录条数相同,
                // 刷新之前,total值是比实际记录条数大1)

                // 需求: 如果删除这条记录之后,当前页没有记录了,就跳转到上一页
                //       如果当前页为1,删除之后记录条数为0,就赋值当前页为1,进行刷新

                //  this.userobj.pagenum:2
                // this.total :6
                // 6-1 = 5 / 4 = 2
                if (
                  Math.ceil((this.total - 1) / this.userObj.pagesize) <
                  this.userObj.pagenum
                ) {
                  this.userObj.pagenum--
                } else if (
                  Math.ceil((this.total - 1) / this.userObj.pagesize) === 0
                ) {
                  this.userObj.pagenum = 1
                }
                // 三元表达式写法   (有缺陷不使用)
                // this.userObj.pagenum = Math.ceil((this.total - 1) / this.userObj.pagesize) ? --this.userObj.pagenum : this.userObj.pagenum

                // 刷新
                this.init()
              }
            })
            .catch((err2) => {
              console.log(err2)
              this.$message({
                type: 'error',
                message: '数据删除失败'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
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
      this.$refs.editForm.validate(async (valid) => {
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
          console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            // 获取总记录数
            this.total = res.data.data.total
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取角色列表初始化
    async roleListInit () {
      const res = await getAllRoleList()
      console.log(res)
      if (res.data.meta.status === 200) {
        this.roleList = res.data.data
      }
    }
  },
  mounted () {
    this.init()
    this.roleListInit()
  }
}
</script>
<style lang="less" scoped>
</style>
