<template>
  <el-row :gutter="10">
    <div class="head-container">
      <el-input v-model="listQuery.name" placeholder="输入关键字查询旅行社" style="width:200px" @keyup.enter.native="handleFilter" />
      <el-button type="primary" style="margin-left:10px" @click="handleFilter">查询</el-button>
    </div>
    <el-col v-for="(data, index) in list" :key="index" :xs="24" :sm="12" :lg="8">
      <el-card shadow="naver">
        <div class="content">
          <span class="left">企业名称</span>
          <span class="right">{{ data.name }}</span>
        </div>
        <div class="content">
          <span class="left">经营场所</span>
          <span class="right">{{ data.address }}</span>
        </div>
        <div class="content">
          <span class="left">法人代表</span>
          <span class="right">{{ data.person }}</span>
        </div>
        <div class="content">
          <span class="left">联系电话</span>
          <span class="right">{{ data.tel }}</span>
        </div>
        <div class="content">
          <span class="left">企业简介</span>
          <span class="right">{{ data.introduction }}</span>
        </div>
        <div style="text-center">
          <el-button type="primary" plain style="width:100%" @click="$refs.pass.dialogFormVisible = true">我要评价</el-button>
        </div>
      </el-card>
    </el-col>
    <evaluation ref="pass" />
  </el-row>
</template>

<script>
import evaluation from '@/views/dashboard/evaluation'
import { getAllAgency } from '@/api/agency'
export default {
  components: { evaluation },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1, // 总页数
        limit: 10 // 每页显示条数
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getAllAgency(this.listQuery).then(response => {
        const list = response.data
        this.list = list
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style>
.head-container{
    margin-left: 5px;
    margin-bottom: 10px;
  }
</style>
