<template>
  <div class="login">
    <el-card class="box-card">
      <div slot="header" style="text-align:center">
        <span>小问卷后台</span>
      </div>
      <el-form :model="userInfo" :rules="rules" ref="loginForm" label-width="100px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userInfo.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: [],
  data () {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          axios.post('/admin/login', this.userInfo)
            .then(({ data }) => {
              this.$message({
                type: 'success',
                message: data.retDesc
              })
              sessionStorage.setItem('islogin', data.ret)
              this.$router.push({name: 'record'})
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: '登陆失败'
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs['loginForm'].resetFields()
    }
  }
}
</script>
<style lang="less">
.login {
  .el-input {
    width: 300px;
    float: left
  }
  width: 500px;
  transform: translate(-50%);
  position: relative;
  top: 50%;
  left: 50%
}
</style>
