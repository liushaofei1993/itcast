<template>
  <div class="home">
    <el-container>
      <!-- 左侧导航菜单区域 -->
      <el-aside width="auto">
        <div class="logo"></div>
        <el-menu
          :router="true"
          :unique-opened="true"
          :default-active="'1-1'"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/home/users">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/home/roles">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>角色列表</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/home/rights">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限列表</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-container>
        <!-- 右侧顶部区域 -->
        <el-header>
          <span class="myicon myicon-menu toggle-btn" @click="isCollapse = !isCollapse"></span>
          <span class="system-title">电商后台管理系统</span>
          <a href="javascript:;" class="exit">退出</a>
        </el-header>
        <!-- 右侧主体部分 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isCollapse: false
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu {
    width: auto;
  }
  // 如果是展开的状态,宽度就是200px,如果是合并的状态,宽度就是auto
  .el-menu:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
    opacity: 0.5;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .exit {
    color: white;
  }
}
</style>
