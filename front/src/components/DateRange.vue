<template>
  <div :class="dateRangeClass">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      placeholder="选择日期范围"
      :format="dateFormat"
      :clearable="false"
      :range-separator="rangeSeparator"
      :picker-options="pickerOption"
      :title="hint"
      @change="dateChange">
    </el-date-picker>
  </div>
</template>

<script>
export default {
  props: ['column', 'dateFormat'],
  data () {
    const that = this
    const shortPickerRange = (daysNum, picker) => {
      const now = Date.now()
      that.pickerShortTime = now
      const end = new Date(now)
      const start = new Date(now - 3600 * 1000 * 24 * daysNum)
      let result
      if (daysNum === -1) {
        result = [end, start]
      } else {
        result = [start, end]
      }
      that.shortDaysNum = daysNum
      picker.$emit('pick', result)
    }

    const shortcuts = [
      {
        text: '今天',
        onClick (picker) {
          shortPickerRange(0, picker)
        }
      }, {
        text: '最近一周',
        onClick (picker) {
          shortPickerRange(7, picker)
        }
      }, {
        text: '最近一个月',
        onClick (picker) {
          shortPickerRange(30, picker)
        }
      }, {
        text: '最近三个月',
        onClick (picker) {
          shortPickerRange(90, picker)
        }
      }, {
        text: '清除',
        onClick (picker) {
          picker.$emit('pick', [])
        }
      }
    ]

    return {
      pickerOption: {
        disabledDate (val) {
          return val.getTime() > Date.now()
        },
        shortcuts: shortcuts
      },
      hint: '',
      pickerShortTime: 0,
      pickerTime: 0,
      shortQueryChangeTime: 0,
      shortDaysNum: undefined,
      dateRange: [],
      rangeSeparator: '至'
    }
  },
  methods: {
    dateChange (val) {
      if (!val) {
        this.shortDaysNum = -2
      } else {
        this.shortDaysNum || (this.shortDaysNum = -1)
      }
      this.$emit('dateChange', val.split(this.rangeSeparator))
    }
  },

  computed: {
    space () {
      return this.$routeIn.params.page.split('/').join('_')
    },
    dateRangeClass () {
      return {
        'date-range': true,
        'date-range-active': this.shortDaysNum >= -1
        // 'date-range-short-active': this.shortDaysNum >= 0
      }
    }
  }
}
</script>

<style lang="less">
.date-range {
  display: inline-block;
  margin-left: 5px;
  vertical-align: middle;
  height: 30px;
  &.date-range-active {
    .el-date-editor .el-input__icon.el-icon-date {
      color: #48576a;
    }
    // &.date-range-short-active .el-date-editor .el-input__icon.el-icon-date {
    //   color: #20a0ff;
    // }
  }
  .el-date-editor {
    width: auto;
    min-width: 20px;
    height: 30px;
    .el-input__inner {
      display: none;
    }
    .el-input__icon.el-icon-date {
      color: #97a8be;
      width: auto;
    }
    .el-picker-panel__shortcut {
    }
  }
}
</style>
