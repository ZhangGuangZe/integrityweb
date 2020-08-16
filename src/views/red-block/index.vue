<template>
  <div class="app-container">
    <div class="head-container">
      <el-input v-model="listQuery.person" placeholder="按照人物查询" style="width:200px" @keyup.enter.native="handleFilter" />
      <el-select
        v-model="listQuery.type"
        clearable
        placeholder="类型"
        class="filter-item"
        style="width: 90px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-input v-model="listQuery.time" placeholder="截止日期" style="width:200px" @keyup.enter.native="handleFilter" />
      <el-button type="primary" style="margin-left:10px" @click="handleFilter">查询</el-button>
      <el-button type="success" @click="handleAdd">添加</el-button>
    </div>

    <el-table :data="list" size="small" style="width: 100%;" border>

      <el-table-column label="人物">
        <template slot-scope="scope">
          <span>{{ scope.row.person }}</span>
        </template>
      </el-table-column>

      <el-table-column label="上榜原因">
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column label="截止日">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="handleUpdate(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="450px">

      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px" style="margin: 0 15px">

        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio label="红榜">红榜</el-radio>
            <el-radio label="黑榜">黑榜</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="人物" prop="person">
          <el-input v-model="temp.person" />
        </el-form-item>

        <el-form-item label="截止日" prop="time">
          <el-input v-model="temp.time" />
        </el-form-item>

        <el-form-item label="原因" prop="reason">
          <el-input v-model="temp.reason" type="textarea" />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addData():updateData()">
          确认
        </el-button>
      </div>

    </el-dialog>

    <!--分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { getAllList, add, update, del } from '@/api/redBlock'
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
      typeOptions: [
        { key: '红榜', display_name: '红榜' },
        { key: '黑榜', display_name: '黑榜' }
      ],
      temp: {
        id: '',
        person: '',
        time: '',
        reason: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑红黑榜信息',
        create: '添加红黑榜信息'
      },
      rules: {
        person: [{ required: true, message: '人物不能为空', trigger: 'blur' }],
        time: [{ required: true, message: '时间不能为空', trigger: 'blur' }],
        reason: [{ required: true, message: '原因不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
      }
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
        console.log(list)
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
    },
    resetTemp() {
      this.temp = {
        person: '',
        time: '',
        reason: '',
        type: ''
      }
    },
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    addData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          add(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.total += 1
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '红黑榜添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(scope) {
      this.temp = Object.assign({}, scope.row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          update(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '红黑榜修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除该条红黑榜吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          console.log(row.id)
          await del(row.id)
          this.list.splice($index, 1)
          this.total -= 1
          this.$notify({
            title: 'Success',
            message: '红黑榜删除成功',
            type: 'success',
            duration: 2000
          })
        })
        .catch(err => { console.error(err) })
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
