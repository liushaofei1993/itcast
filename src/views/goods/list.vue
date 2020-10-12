<template>
  <div class="goods">
        <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin: 15px 0">
      <el-input
        placeholder="请输入内容"
        v-model="goodsObj.query"
        class="input-with-select"
        style="width: 300px; margin-right: 10px"
        @keyup.enter.native="searchGoods"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchGoods"
        ></el-button>
      </el-input>
      <el-button type="success" plain @click="$router.push({name: 'add'})">添加商品</el-button>
    </div>
    <!-- 表格数据展示 -->
    <el-table :data="goodsList" style="width: 100%" border>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="120"> </el-table-column>
      <el-table-column prop="" label="商品状态" width="120">
        <template slot-scope="scope">
          {{scope.row.goods_state | stateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="120"> </el-table-column>
      <el-table-column prop="" label="创建时间" width="150">
        <template slot-scope="scope">
          {{scope.row.add_time | timeFormat}}
        </template>
      </el-table-column>
      <!-- 添加操作列 -->
      <el-table-column label="操作" width="280">
        <template slot-scope="">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="primary"
              icon="el-icon-delete"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="审核"
            placement="top"
          >
            <el-button type="primary" icon="el-icon-rank"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsObj.pagenum"
      :page-sizes="[ 10, 20, 30, 40, 50,]"
      :page-size="goodsObj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
import { getAllGoodsList } from '@/api/goods_index.js'
export default {
  data () {
    return {
      total: 100,
      goodsObj: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      goodsList: []
    }
  },
  filters: {
    timeFormat (time) {
      time = new Date(time * 1000)
      // console.log(time)
      return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
    },
    stateFormat (state) {
      if (state === 1) {
        return '上架'
      } else if (state === 2) {
        return '下架'
      } else {
        return ''
      }
    }
  },
  methods: {
    // 搜索功能
    searchGoods () {
      this.goodsListInit()
    },
    // 切换每页显示记录数触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      // 修改全局的goodsObj.pagesize的值为val
      this.goodsObj.pagesize = val
      // 重新发送(修改后的goodsObj)请求,获取数据
      this.goodsListInit()
    },
    // 切换当前页码触发
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      // 修改全局的goodsObj.pagenum的值为val
      this.goodsObj.pagenum = val
      // 重新发送(修改后的goodsObj)请求,获取数据
      this.goodsListInit()
    },
    // 商品列表数据初始化
    goodsListInit () {
      getAllGoodsList(this.goodsObj)
        .then(res => {
          console.log(res)
          this.goodsList = res.data.data.goods
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.goodsListInit()
  }
}
</script>
<style lang="less" scoped>

</style>
