<template>
  <div class="question">
    <div class="head">
      <b><span>分享小问卷</span></b>
    </div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="主题：">
        <a class="title" href="#/reference"><span>初探Mongodb</span></a>
      </el-form-item>
      <el-form-item label="你的签名：">
        <el-input size='small' v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="你感兴趣的：">
        <el-checkbox-group v-model="form.interests">
          <el-checkbox
            v-for="(item, index) of interests"
            :label="item.value"
            :key="index"
          >
          {{item.text}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="其他兴趣点：">
        <el-input type="textarea" v-model="form.other"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :disbaled="disbaled">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import { debounce } from '@/helper/tools'
import { interests } from '@/config'
export default {
  props: [],
  data () {
    return {
      disbaled: false,
      interests,
      form: {
        interests: [0, 1],
        name: '',
        other: '',
        comments: ''
      }
    }
  },
  methods: {
    goToRef () {
      this.$router.push({name: 'reference'})
    },
    onSubmit: debounce(function() {
      this.disbaled = true
      const data = Object.assign({}, this.form, {
        interests: this.form.interests.map(v => this.interests.filter(item => item.value === v)[0].text)
      })
      axios.post('/record/insert', data)
      .then((data) => {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.disbaled = false
      })
      .catch((e) => {
        console.log(e)
        this.$message({
          type: 'error',
          message: '提交失败'
        })
        this.disbaled = false
      })
    },1000)
  }
}
</script>
<style lang="less">
.question {
  font-size: 18px;
  .head {
    text-align: center;
    padding-bottom: 40px;
  }
  .title {
    float: left;
  }
  .el-checkbox-group {
    padding: 12px 12px 12px 0px;
  }
  .el-checkbox {
    padding-bottom: 10px;
    display: flex;
    margin-left: 0px;
    justify-content: flex-start
  }
  width: 500px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%)
}
</style>
