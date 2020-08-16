<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1" title="点击上传头像" class="avatar">
            </div>
            <ul class="user-info">
              <li>登录账号 <div class="user-right">{{ username }}</div></li>
              <li>手机号码 <div class="user-right">{{ phone }}</div></li>
              <li>真实姓名 <div class="user-right">{{ realname }}</div></li>
              <li>性别 <div class="user-right">{{ gender }}</div></li>
              <li v-if="level">职业等级 <div class="user-right">{{ level }}</div></li>
              <li v-if="language">语言种类 <div class="user-right">{{ language }}</div></li>
              <li>
                安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户资料</span>
          </div>
          <div>
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="50px">
              <el-form-item label="电话" prop="phone">
                <el-input v-model="temp.phone" style="width: 50%;" />
              </el-form-item>

              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="temp.gender" style="width: 178px">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateData">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="checkPermission(['tourist'])" :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>我的投诉</span>
          </div>
          <el-card v-for="(data, index) in list" :key="index" shadow="naver">
            <div class="list">
              <span>投诉对象：</span>
              <span>{{ data.object }}</span>
            </div>
            <div class="list">
              <span>投诉原因：</span>
              <span>{{ data.reason }}</span>
            </div>
            <div class="list">
              <span>投诉时间：</span>
              <span>{{ data.time }}</span>
            </div>
            <div class="list">
              <span>投诉状态：</span>
              <span>{{ data.status }}</span>
            </div>
            <div class="list">
              <span>投诉结果：</span>
              <span>{{ data.result }}</span>
            </div>
            <div class="list">
              <span>操作人员：</span>
              <span>{{ data.operator }}</span>
            </div>
          </el-card>
        </el-card>
      </el-col>
    </el-row>
    <updatePass ref="pass" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { editUser } from '@/api/user'
import { getUserComplaints } from '@/api/complaint'
import updatePass from '@/views/center/updatePass'
import { isValidPhone } from '@/utils/validate'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Center',
  components: { updatePass },
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
      list: null,
      temp: {
        username: '',
        phone: '',
        gender: '',
        time: '',
        reason: '',
        status: '',
        operator: '',
        result: ''
      },
      rules: {
        phone: [{ required: true, trigger: 'blur', validator: validPhone }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'phone',
      'realname',
      'gender',
      'level',
      'language',
      'name'
    ])
  },
  created() {
    this.getList()
    this.getUser()
    this.temp = {
      username: this.username,
      phone: this.phone,
      gender: this.gender
    }
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      getUserComplaints(this.username).then(response => {
        const list = response.data

        this.list = list
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getUser() {
      this.user = {
        username: this.username,
        phone: this.phone,
        realname: this.realname,
        level: this.level,
        language: this.language,
        gender: this.gender,
        name: this.name
      }
    },
    updateData() {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            editUser(this.temp).then(() => {
              this.$notify({
                title: 'Success',
                message: '信息修改成功',
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

<style rel="stylesheet/scss" lang="scss">
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%
  }
  .user-info {
    padding-left: 0px;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      border-top: 1px solid #F0F3F4;
      padding: 11px 0px;
      font-size: 13px;
    }
    .user-right {
      float: right;

      a{
        color: #317EF3;
      }
    }
  }
  .list{
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0px;
    font-size: 13px;
  }
</style>

