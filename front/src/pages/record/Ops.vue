<template>
<div class="ops">
  <el-button plain size="small" type="primary" @click.stop="visible = true">修改</el-button>
  <el-button plain size="small" type="primary" @click.stop="del" :disabled="loading.del">删除</el-button>
  <el-dialog title="修改" :visible.sync="visible">
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
      <el-button type="primary" @click="modify" :disabled="loading.modify">修 改</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import axios from 'axios'
import { interests } from '@/config'
export default {
  props: ['scopeData', 'header'],
  data () {
    return {
      visible: false,
      loading: {
        modify: false,
        del: false
      },
      // recordInfo: {
      //   name: '',
      //   interests: [],
      //   comments: '',
      //   other: '',
      //   id: ''
      // },
      interests: interests
    }
  },
  computed: {
    recordInfo () {
      return {
        name: this.scopeData.row.name,
        interests: this.scopeData.row.interests.map(label => this.interests.filter(item => item.text === label)[0].value),
        comments: this.scopeData.row.comments,
        other: this.scopeData.row.other,
        id: this.scopeData.row._id
      }
    }
  },
  // watch: {
  //   'scopeData.row': {
  //     deep: true,
  //     handler: function (row) {
  //       this.recordInfo = {
  //         name: row.name,
  //         interests: row.interests.map(label => this.interests.filter(item => item.text === label)[0].value),
  //         comments: row.comments,
  //         other: row.other,
  //         id: row._id
  //       }
  //     }
  //   }
  // },
  mounted () {
    console.log(this.recordInfo.interests)
    debugger
  },
  methods: {
    modify () {
      this.loading.modify = true
      const data = Object.assign({}, this.recordInfo, {
        interests: this.recordInfo.interests.map(v => this.interests.filter(item => item.value === v)[0].text)
      })
      axios.put('/record/update', data)
        .then(() => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.visible = false
          this.loading.modify = false
          this.$emit('refresh')
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: '修改失败'
          })
          this.loading.modify = false
        })
    },
    del () {
      this.loading.del = true
      axios.delete('/record/delete', {
        data: {
          id: this.recordInfo.id
        }
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.loading.del = false
          this.$emit('refresh')
        })
        .catch((e) => {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
          this.loading.del = false
        })
    }
  }
}
</script>
<style lang='less'>
</style>
