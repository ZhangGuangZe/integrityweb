<template>
  <el-row :gutter="10">
    <div class="head-container">
      <el-input v-model="listQuery.realname" placeholder="按照导游姓名查询" style="width:200px" @keyup.enter.native="handleFilter" />
      <el-select
        v-model="listQuery.level"
        clearable
        placeholder="导游等级"
        class="filter-item"
        style="width: 200px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in levelOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.gender"
        clearable
        placeholder="性别"
        class="filter-item"
        style="width: 90px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in genderOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-button type="primary" style="margin-left:10px" @click="handleFilter">查询</el-button>
    </div>
    <el-col v-for="(data, index) in list" :key="index" :xs="24" :sm="8" :md="6">
      <el-card shadow="naver">
        <div style="text-align: center">
          <img src="../../assets/avatar.png" class="image">
        </div>
        <div class="content">
          <span class="left">姓名</span>
          <span class="right">{{ data.realname }}</span>
        </div>
        <div class="content">
          <span class="left">导游证号</span>
          <span class="right">{{ data.username }}</span>
        </div>
        <div class="content">
          <span class="left">性别</span>
          <span class="right">{{ data.gender }}</span>
        </div>
        <div class="content">
          <span class="left">职业等级</span>
          <span class="right">{{ data.level }}</span>
        </div>
        <div class="content">
          <span class="left">导游语种</span>
          <span class="right">{{ data.language }}</span>
        </div>
        <div style="text-center">
          <el-button type="primary" plain style="width:100%" @click="$refs.pass.dialogFormVisible = true">我要评价</el-button>
          <!-- <el-button type="text">共 条评价</el-button> -->
        </div>
      </el-card>
    </el-col>
    <evaluation ref="pass" />
  </el-row>
</template>

<script>
import evaluation from '@/views/dashboard/evaluation'
import { getAllUsers } from '@/api/user'
export default {
  components: { evaluation },
  data() {
    return {
      levelOptions: [
        { key: '初级导游', display_name: '初级导游' },
        { key: '高级导游', display_name: '高级导游' },
        { key: '特级导游', display_name: '特级导游' }
      ],
      genderOptions: [
        { key: '男', display_name: '男' },
        { key: '女', display_name: '女' }
      ],
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
      getAllUsers(this.listQuery).then(response => {
        const list = response.data
        const data = []
        list.map((item) => {
          if (item.roleid === 2) { // 筛选导游
            data.push(item)
          }
        })
        this.list = data
        this.total = data.length // 导游总数

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

<style scope>

  .content{
    padding: 5px 0;
  }
  .left {
    font-size: 13px;
    color: #999;
  }

  .right {
    padding: 0;
    font-size: 13px;
    float: right;
    color: rgb(68, 68, 68);
  }

  .el-col {
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .image{
    width: 150px;
  }

  .head-container{
    margin-left: 5px;
    margin-bottom: 10px;
  }
</style>
