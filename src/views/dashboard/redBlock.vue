<template>
  <el-row :gutter="10">
    <el-col :xs="24" :sm="12">
      <el-card shadow="naver">
        <div class="text-center">红榜</div>
        <div v-for="(data, index) in red" :key="index" class="list">
          {{ index + 1 }}
          <span>{{ data.person }}</span>
          <span>{{ data.reason }}</span>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="12">
      <el-card shadow="naver">
        <div class="text-center">黑榜</div>
        <div v-for="(data, index) in block" :key="index" class="list">
          {{ index + 1 }}
          <span>{{ data.person }}</span>
          <span>{{ data.reason }}</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { getTimeList } from '@/api/redBlock'
export default {
  data() {
    return {
      list: null,
      red: null,
      block: null,
      time: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getTimeList('20200101').then(response => {
        const list = response.data
        const red = []
        const block = []

        list.map(item => {
          if (item.type === '红榜') {
            red.push(item)
            this.red = red
          }
          if (item.type === '黑榜') {
            block.push(item)
            this.block = block
          }
        })
      })
    },
    handleFilter() {
      this.getList()
    }
  }
}
</script>

<style>
  .text-center{
    text-align: center;
    padding-bottom: 5px;
  }

  .list{
    padding: 5px;
  }

  .head-container{
    margin-left: 5px;
    margin-bottom: 10px;
  }
</style>
