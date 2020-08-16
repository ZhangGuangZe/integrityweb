<template>
  <div class="app-container">
    <div class="head-container">
      <el-input v-model="listQuery.username" placeholder="按照用户名查询" style="width:200px" @keyup.enter.native="handleFilter" />
      <el-button type="primary" style="margin-left:10px" @click="handleFilter">查询</el-button>
      <el-button type="success" @click="handleAdd">添加</el-button>
    </div>

    <el-table :data="list" size="small" style="width: 100%;">

      <el-table-column label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电话" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="真实姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-value="1"
            inactive-value="0"
          />
        </template>
      </el-table-column> -->

      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="handleUpdate(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="450px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="margin: 0 15px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>

        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>

        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model="temp.realname" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="temp.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
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
import { getAllUsers, add, update, del } from '@/api/user'
import Pagination from '@/components/Pagination' // 分页组件
import { isValidPhone } from '@/utils/validate'

export default {
  components: { Pagination },
  data() {
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('电话号码不能为空'))
      } else if (!isValidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
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
        username: '',
        phone: '',
        realname: '',
        gender: '',
        enabled: 'false'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑游客信息',
        create: '添加游客信息'
      },
      rules: {
        username: [
          { required: true, message: '用户名为必填项', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 在 20 个字符之间', trigger: 'blur' }
        ],
        phone: [{ required: true, trigger: 'blur', validator: validPhone }],
        realname: [{ required: true, message: '真实为必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAllUsers(this.listQuery).then(response => {
        const list = response.data
        const data = []
        list.map((item) => {
          if (item.roleid === 3) { // 筛选角色编号为3的用户
            data.push(item)
          }
        })
        this.list = data
        this.total = data.length // 角色为3的用户总数

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
        username: '',
        phone: '',
        realname: '',
        gender: '',
        enabled: '',
        roleid: 3
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
              message: '初始密码：000000',
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
              if (v.username === this.temp.username) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '游客修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除这位游客吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await del(row.username)
          this.list.splice($index, 1)
          this.total -= 1
          this.$notify({
            title: 'Success',
            message: '游客删除成功',
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
