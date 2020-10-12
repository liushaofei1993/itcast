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
          <el-submenu :index="first.order + ''" v-for="first in menuList" :key="first.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{first.authName}}</span>
            </template>
            <el-menu-item :index="'/home/' + second.path" v-for="second in first.children" :key="second.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{second.authName}}</span>
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
import { getRightsLeftMenu } from '@/api/rights_index.js'
export default {
  data () {
    return {
      isCollapse: false,
      menuList: []
    }
  },
  mounted () {
    getRightsLeftMenu()
      .then(res => {
        // console.log(res)
        this.menuList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
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
