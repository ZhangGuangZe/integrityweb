<template>
  <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="margin: 0 15px">
    <el-form-item label="投诉对象">
      <el-input v-model="temp.object" placeholder="请输入投诉对象：旅行社/导游" />
    </el-form-item>

    <el-form-item label="投诉原因">
      <el-input v-model="temp.reason" type="textarea" placeholder="何时何地何事" />
    </el-form-item>

    <el-form-item label="联系人" prop="username">
      <el-input v-model="temp.username" />
    </el-form-item>

    <el-form-item label="联系电话">
      <el-input v-model="temp.phone" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" plain @click="updateData">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import { mapGetters } from 'vuex'
import { add } from '@/api/complaint'
import { isValidPhone } from '@/utils/validate'

export default {
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
      listQuery: {
        page: 1, // 总页数
        limit: 10 // 每页显示条数
      },
      list: {},
      temp: {
        username: '',
        phone: '',
        object: '',
        reason: ''
      },
      rules: {
        object: [{ required: true, trigger: 'blur', message: '投诉对象不能为空' }],
        reason: [{ required: true, trigger: 'blur', message: '投诉原因不能为空' }],
        phone: [{ required: true, trigger: 'blur', validator: validPhone }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'phone'
    ])
  },
  created() {
    this.getUser()
    this.temp = {
      username: this.username,
      phone: this.phone
    }
  },
  methods: {
    getUser() {
      this.user = {
        username: this.username,
        phone: this.phone
      }
    },
    updateData() {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            add(this.temp).then(() => {
              this.$notify({
                title: 'Success',
                message: '投诉添加成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    }
  }
}
</script>

<style>
  .el-form{
    width: 365px;
  }
</style>
