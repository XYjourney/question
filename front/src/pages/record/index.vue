<template>
  <div>
    <RecordsList
      :config = "config"
    >
      <template slot="querybar">
        <el-card class="box-card">
          <el-form :inline="true" ref="form" :model="config.queryParams" label-position="left">
            <el-form-item label="姓名:">
              <el-input v-model="config.queryParams.name"></el-input>
            </el-form-item>
            <el-form-item label="其他兴趣点:">
              <el-input v-model="config.queryParams.other"></el-input>
            </el-form-item>
            <el-form-item label="评论:">
              <el-input v-model="config.queryParams.comments"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click="queryData">查询</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </template>
      <template slot="toolbarLeft">
        <el-button size="small" plain type="primary" @click.stop="visible = true">增加</el-button>
      </template>
    </RecordsList>
    <el-dialog title="插入" :visible.sync="visible">
      <el-form :model="recordInfo">
        <el-form-item label="姓名">
          <el-input v-model="recordInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="你感兴趣的：">
          <el-checkbox-group v-model="recordInfo.interests">
            <el-checkbox
              v-for="(item, index) of interests"
              :label="item.value"
              :key="index"
            >
            {{item.text}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="你的建议:">
          <el-input type="textarea" v-model="recordInfo.other"></el-input>
        </el-form-item>
        <el-form-item label="评论:">
          <el-input type="textarea" v-model="recordInfo.comments"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="add" :disabled="disabled">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import config from './config'
import { interests } from '@/config'
import axios from 'axios'
import RecordsList from '@/components/TableComponent'
export default {
  props: [],
  data () {
    return {
      interests,
      visible: false,
      disabled: false,
      config: Object.assign({}, config),
      recordInfo: {
        name: '',
        interests: [0, 1],
        other: '',
        comments: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    add () {
      this.disabled = true
      const data = Object.assign({}, this.recordInfo, {
        interests: this.recordInfo.interests.map(v => this.interests.filter(item => item.value === v)[0].text)
      })
      axios.post('/record/insert', data)
        .then(() => {
          this.$message({
            type: 'success',
            message: '插入成功'
          })
          this.disabled = false
          this.visible = false
          this.queryData()
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: '插入失败'
          })
          this.disabled = false
        })
    },
    queryData () {
      this.config.refreshFlag = !this.config.refreshFlag
    }
  },
  components: {
    RecordsList
  }
}
</script>
