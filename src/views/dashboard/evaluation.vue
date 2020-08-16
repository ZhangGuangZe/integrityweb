<template>
  <div style="display: inline-block">
    <el-dialog :visible.sync="dialogFormVisible" :title="title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">
        <el-form-item label="对象" prop="person">
          <el-input v-model="form.person" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="评价星级" prop="star">
          <el-rate
            v-model="form.star"
            :colors="colors"
            style="margin-top: 5px"
          />
        </el-form-item>
        <el-form-item label="评价内容" prop="content">
          <el-input v-model="form.content" style="width: 370px;" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { add } from '@/api/evaluation'
export default {
  data() {
    return {
      total: 0,
      dialogFormVisible: false,
      title: '添加评价',
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      form: { person: '', username: '', star: '', content: '' },
      rules: {
        person: [
          { required: true, message: '评价对象不能为空', trigger: 'blur' }
        ],
        star: [
          { required: true, message: '请输入评价星级', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入评价内容', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  created() {
    this.getUser()
    this.form = {
      username: this.username
    }
  },
  methods: {
    getUser() {
      this.user = {
        username: this.username
      }
    },
    handleAdd() {
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = true
          add(this.form).then(() => {
            this.resetForm()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '评价添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { star: 0, content: '' }
    }
  }
}
</script>

<style scoped>

</style>
