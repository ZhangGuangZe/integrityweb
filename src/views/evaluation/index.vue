<template>
  <div class="app-container">
    <div class="head-container">
      <el-date-picker
        v-model="listQuery.time"
        type="date"
        style="width: 200px"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        @change="handleFilter"
      />
      <el-select
        v-model="listQuery.star"
        clearable
        placeholder="按照评分查询"
        @change="handleFilter"
      >
        <el-option
          v-for="item in starOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-button type="primary" style="margin-left:10px" @click="handleFilter">查询</el-button>
    </div>

    <el-table :data="list" size="small" style="width: 100%;">

      <el-table-column label="对象">
        <template slot-scope="scope">
          <span>{{ scope.row.person }}</span>
        </template>
      </el-table-column>

      <el-table-column label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="评分">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.star"
            disabled
            text-color="#ff9900"
          />
        </template>
      </el-table-column>

      <el-table-column label="评论人">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

    </el-table>

    <!--分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { getAllList } from '@/api/evaluation'
import Pagination from '@/components/Pagination' // 分页组件

export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1, // 总页数
        limit: 10 // 每页显示条数
      },
      starOptions: [
        { key: '1', display_name: '1星' },
        { key: '2', display_name: '2星' },
        { key: '3', display_name: '3星' },
        { key: '4', display_name: '4星' },
        { key: '5', display_name: '5星' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAllList(this.listQuery).then(response => {
        const list = response.data

        this.list = list
        this.total = list.length

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
<style scoped>
    .head-container{
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .el-date-editor.el-input{
      width: 100%;
    }
</style>
