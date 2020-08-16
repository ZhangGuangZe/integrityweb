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
        v-model="listQuery.status"
        clearable
        placeholder="按照处理状态查询"
        @change="handleFilter"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-button type="primary" style="margin-left:10px" @click="handleFilter">查询</el-button>
    </div>

    <el-table :data="list" size="small" style="width: 100%;">

      <el-table-column label="投诉对象">
        <template slot-scope="scope">
          <span>{{ scope.row.object }}</span>
        </template>
      </el-table-column>

      <el-table-column label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="原因">
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>

      <el-table-column label="处理状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column label="处理人">
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>

      <el-table-column label="处理结果">
        <template slot-scope="scope">
          <span>{{ scope.row.result }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="handleUpdate(scope)">处理</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="450px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px" style="margin: 0 15px">
        <el-form-item label="处理状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio label="未处理">未处理</el-radio>
            <el-radio label="处理中">处理中</el-radio>
            <el-radio label="已处理">已处理</el-radio>
            <el-radio label="不予受理">不予受理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理结果" prop="result">
          <el-input v-model="temp.result" type="textarea" />
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
import { getAllList, update } from '@/api/complaint'
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
      statusOptions: [
        { key: '未处理', display_name: '未处理' },
        { key: '处理中', display_name: '处理中' },
        { key: '已处理', display_name: '已处理' },
        { key: '不予受理', display_name: '不予受理' }
      ],
      temp: {
        object: '',
        time: '',
        reason: '',
        status: '',
        operator: '',
        result: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '处理投诉信息'
      },
      rules: {
        status: [{ required: true, message: '处理状态不能为空', trigger: 'blur' }],
        result: [{ required: true, message: '处理结果不能为空', trigger: 'blur' }]
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
        reason: ''
      }
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
              message: '处理成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
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
