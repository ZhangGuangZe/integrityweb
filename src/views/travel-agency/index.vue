<template>
  <div class="app-container">
    <div class="head-container">
      <el-input v-model="listQuery.name" placeholder="按照旅行社名称查询" style="width:200px" @keyup.enter.native="handleFilter" />
      <el-button type="primary" style="margin-left:10px" @click="handleFilter">查询</el-button>
      <el-button type="success" @click="handleAdd">添加</el-button>
    </div>

    <el-table :data="list" size="small" style="width: 100%;" border>

      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="简介">
        <template slot-scope="scope">
          <span>{{ scope.row.introduction }}</span>
        </template>
      </el-table-column>

      <el-table-column label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>

      <el-table-column label="负责人">
        <template slot-scope="scope">
          <span>{{ scope.row.person }}</span>
        </template>
      </el-table-column>

      <el-table-column label="营业状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
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

        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>

        <el-form-item label="电话" prop="tel">
          <el-input v-model="temp.tel" />
        </el-form-item>

        <el-form-item label="负责人" prop="person">
          <el-input v-model="temp.person" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="禁用">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="简介" prop="description">
          <el-input v-model="temp.introduction" type="textarea" />
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
import { getAllAgency, add, update, del } from '@/api/agency'
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
      temp: {
        id: '',
        name: '',
        address: '',
        tel: '',
        person: '',
        status: '',
        introduction: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑旅行社信息',
        create: '添加旅行社信息'
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        tel: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
        person: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '营业状态不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAllAgency(this.listQuery).then(response => {
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
        name: '',
        address: '',
        tel: '',
        person: '',
        status: '',
        introduction: ''
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
            this.list.push(this.temp)
            this.total += 1
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '旅行社添加成功',
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
              message: '旅行社修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除该旅行社吗?', '警告', {
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
            message: '旅行社删除成功',
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
</style>
