<template>
<div class="common-table">
  <div class="query">
    <slot name="querybar"></slot>
  </div>
  <div class="toolbar" v-if="toolbarVisible">
    <div style="float:left">
      <slot name="toolbarLeft">
        <div v-if="toolbarLeftDefaultVisible">
          <div class="selection-info">
            已选 {{ selectedLength || 0}} 条
          </div>
          <div class="actions-batch">
            <el-button @click.stop="handleSelection" size="small" :disabled="!selectedLength">{{ btachButtonText }}</el-button>
          </div>
        </div>
      </slot>
    </div>
    <div style="float:right">
      <slot name="toolbarRight"></slot>
      <el-button size="small" icon="search" type="text" @click="refresh" style="margin-right: 15px">刷新</el-button>
      <el-dropdown trigger="click" :hide-on-click="false">
        <el-button size="small" icon="menu" type="text">选择显示列</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-checkbox-group v-model="tableHeaderCheckList" @change="tableHeaderChange">
            <el-dropdown-item v-for="(item, index) in tableHeaders" :key="'dropdown'+index">
              <el-checkbox :label="item.prop">{{ item.label }}</el-checkbox>
            </el-dropdown-item>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
  <div style="width:100%">
    <el-table
      :row-class-name="rowClassFun"
      :data="tableData"
      :fit="true"
      :height="height"
      :default-sort="sortConfig"
      border
      empty-text="暂无记录"
      @row-click="handleRow"
      @sort-change="handleSort"
      @filter-change="handleFilter"
      @selection-change="handleSelection"
    >
      <el-table-column v-if="type" :type="type"></el-table-column>
      <el-table-column v-for="header in tableHeaderShowList"
        v-if="header.visible === undefined ? true : header.visible"
        :prop="header.prop"
        :min-width="header.width || 100"
        :type="header.type"
        :align="header.align"
        :header-align="header.align"
        :render-header="renderHeader"
        :column-key="header.filterKey || header.prop"
        :label="header.label"
        :filtered-value="header.filteredValue"
        :sortable="header.sortable"
        :filters="header.filter"
        :filter-method="header.filterMethod"
        :filter-multiple="header.filterMultiple"
        filter-placement="bottom-start"
        :key="header.prop">
        <template slot-scope="scope">
          <div v-if="header.compFormatter">
            <component :is="header.compFormatter" :tableName="tableName" :scopeData="scope" :header="header" :identity="identity" @refresh="refresh"></component>
          </div>
          <div v-else-if="header.formatter">
            <div v-html="formatters(header.formatter, scope.row, header)">
            </div>
          </div>
          <div v-else-if="header.valueFormatter">
            {{ header.valueFormatter(scope.row, scope.column, scope.row[header.prop]) }}
          </div>
          <div v-else>
            {{ scope.row[header.prop] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="pagination.sizes"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
  </div>
</div>
</template>
<script>
/**
 * 说明：组件通过配置文件驱动
 * prop: config, identity
 * 格式如下：
   {
    getData:() => {
      return {
        result: [],
        paginationInfo: {
          totalRecord: number
        }
    },
    refreshFlag: false, // 父组件通过toggle该值触发表格刷新
    queryParams: {},
    pagination: {
      current: 1,
      size: 20,
      total: 0,
      sizes: [10, 20, 30]
    },
    cellComponents: {
      // cell组件,table传scopedata给cell组件,cell通过触发refresh事件更新table
      // header组件
    },
    options: [
      {
        width: '',
        prop: '',
        label: '',
        sortable: false,
        visible: true,  // 隐藏|显示
        valueFormatter:  (row, column, value) => row.empid + '/' + row.name,
        filterMultiple: false,
        filterFactory: async () => {},
        filter: [],
        compFormatter: vue, // 组件
        filterRelateKey: '', // 关联筛选的key
        filterKey: '', // 筛选时请求参数
        fitlerRelateParams: (val) => {
          return { groupId: val }
        },  // 关联搜索时的参数
        roles: [], // 权限列表
        headerFormatter: (createElement, header, column) => {},
        dateRange: boolean,
        numRange: boolean
      }
    }
 */
import { formatters } from '@/helper/formatter'
import DateRange from './dateRange'
import axios from 'axios'
export default {
  props: ['config'],
  data () {
    return {
      btachButtonText: this.config.btachButtonText || '批量操作',
      selectedLength: 0,
      sortConfig: {},
      tableName: this.config.tableName || '',
      height: this.config.height || undefined,
      toolbarVisible: this.config.toolbarVisible,
      type: this.config.type,
      url: this.config.url,
      params: this.config.queryParams,
      tableHeaders: [],
      tableData: [],
      tableHeaderCheckList: [],
      pagination: this.config.pagination,
      toolbarLeftDefaultVisible: this.config.toolbarLeftDefaultVisible
    }
  },
  beforeMount () {
    if (this.config.cellComponents) {
      Object.keys(this.config.cellComponents).map(item => {
        this.$options.components[item] = this.config.cellComponents[item]
      })
      // console.log('成功注册细胞组件')
    }
  },
  mounted () {
    this.getTableHeaders()
    this.getTableData()
    this.initFilter()
  },

  computed: {
    tableHeaderShowList () {
      return this.tableHeaders.filter(item => item.visible === undefined ? true : item.visible)
    }
  },
  watch: {
    'config.refreshFlag': function () {
      this.refresh()
    }
  },
  methods: {
    rowClassFun (row) {
      if (this.config.rowClassFun) {
        this.config.rowClassFun(row)
      }
    },
    formatters (foos, row, header) {
      const val = row[header.prop]
      if (!foos) {
        if (val === undefined || val === null) {
          return '--'
        } else {
          return val
        }
      }
      return foos.split('|').reduce((val, foo) => {
        return formatters[foo](val, row)
      }, row[header.prop])
    },
    getTableHeaders () {
      const identity = this.identity || {}
      this.tableHeaders = this.config.options.filter((item) => {
        if (item.roles === undefined) {
          return true
        } else if (item.roles.indexOf(identity.role) !== -1 || item.roles.indexOf(identity.fullrole) !== -1) {
          return true
        } else {
          return false
        }
      })
      this.tableHeaderCheckList = this.tableHeaders.filter(item => item.visible === undefined ? true : item.visible).map(item => item.prop)
    },
    initFilter () {
      var _that = this
      this.tableHeaders.forEach((item) => {
        if (typeof item.filterFactory === 'function') {
          item.filterFactory(_that.identity).then((res) => {
            item.filter = res
          })
        }
      })
    },
    handleFilter (filter) {
      var _that = this
      const header = this.tableHeaders.filter(item => (item.filterKey || item.prop) === Object.keys(filter)[0])[0]
      const key = header.filterKey || header.prop
      if (this.config.handleFilter) {
        this.config.handleFilter(filter, header, this)
      } else {
        if (header.filterRelatedKey) {
          this.tableHeaders.forEach((item) => {
            if (item.prop === header.filterRelatedKey) {
              item.filterFactory(_that.identity, header.fitlerRelateParams(filter[key][0])).then((res) => {
                item.filter = res
              })
            }
          })
        }
        this.params[key] = filter[key][0]
      }
      this.refresh()
    },
    handleSelection (selection) {
      this.selectedLength = selection.length
      this.$emit('selection-change', selection)
    },
    handleRow (row, event, column) {
      this.$emit('row-click', row, event, column)
    },
    handleSort ({ column, prop, order }) {
      if (this.config.handleSort) {
        this.config.handleSort({ column, prop, order })
      } else {
        this.params.sortName = prop ? prop + (order === 'descending' ? 'Desc' : 'Asc') : ''
      }
      this.refresh()
    },

    handleSizeChange (size) {
      this.pagination.size = size
      this.params.recordPerPage = size
      this.refresh()
    },

    handleCurrentChange (current) {
      this.pagination.current = current
      this.params.pageNum = current
      this.refresh()
    },

    refresh: function () {
      debugger
      this.getTableData()
    },

    getTableData () {
      axios.get(this.url, {
        params: { ...this.params, time: new Date().getTime() }
      }).then(({ data }) => {
        const res = this.config.handleData
          ? this.config.handleData(data)
          : data.ret
        this.tableData = res.result
        this.pagination.total = res.paginationInfo.totalRecord
        this.$emit('total-record-change', this.pagination.total, this.tableName)
      }).catch((e) => {
        this.$message({
          type: 'error',
          message: '获取数据失败'
        })
      })
    },

    tableHeaderChange (showList) {
      this.tableHeaders.forEach((item, index) => {
        if (showList.indexOf(item.prop) !== -1) {
          item.visible = true
        } else {
          item.visible = false
        }
      })
    },

    renderHeader (createElement, { column, $index }) {
      const header = this.tableHeaders.filter(item => {
        return item.prop === column.property
      })[0]
      const desc = header.desc || ''
      const headerFormatter = header.headerFormatter
      const headerDateRange = header.dateRange
      if (headerFormatter) {
        return headerFormatter(createElement, header, column)
      } else if (headerDateRange) {
        return createElement('span', {
          on: {
            click: (event) => {
              event.stopPropagation()
            }
          },
          attrs: {
            title: desc
          }
        },
        [
          column.label,
          createElement(DateRange, {
            props: {
              column: column,
              dateFormate: header.dateFormate || 'yyyy-MM-dd'
            },
            on: {
              dateChange: (val) => {
                this.params[header.prop + 'From'] = val[0]
                this.params[header.prop + 'To'] = val[1]
                this.refresh()
              }
            }
          })
        ])
      } else {
        return createElement('span', {
          on: {
            click: (event) => {
              event.stopPropagation()
            }
          },
          attrs: {
            title: desc
          }
        },
        [
          column.label
        ])
      }
    }
  }
}
</script>
<style lang="less">
.common-table {
  .selection-info {
    display: inline-block;
    color: #48576a;
    font-size: 14px;
  }
  .actions-batch {
    display: inline-block;
    padding: 0 16px;
  }
  .el-table-filter {
    max-height: 500px;
    overflow: auto;
  }
  .toolbar {
    overflow: hidden;
    padding: 10px 16px;
    border: 1px solid #dfe6ec;
    background-color: #fafafa;
  }
}
</style>
