import OPS from './ops'
import TagSelect from './tagSelect'
import { interests } from '../../config/index'
export default {
  // 是否支持多选
  // type: 'selection',
  // 数据接口的请求参数
  url: '/record/list',
  toolbarVisible: true,
  refreshFlag: false,
  queryParams: {
    // name: '',
    comments: '',
    interests: '',
    pageNum: 1,
    recordPerPage: 20
  },
  handleFilter: function (filter, header, scope) {
    scope.config.queryParams[header.prop] = JSON.stringify(filter[header.prop].map(v => interests.filter(item => item.value === v)[0].text))
  },
  pagination: {
    current: 1,
    size: 20,
    total: 0,
    sizes: [10, 20, 30]
  },
  // cell组件,table传scopedata给cell组件,cell通过触发refresh事件更新table
  cellComponents: {
    OPS,
    TagSelect
  },
  options: [
    {
      width: 100,
      prop: 'name',
      label: '姓名',
      visible: true,
      align: 'left',
      valueFormatter: (row, column, value) => (value || row.ip || '--')
    },
    {
      width: 300,
      prop: 'interests',
      label: '兴趣点',
      align: 'left',
      filter: interests,
      compFormatter: 'TagSelect'
    },
    {
      width: 100,
      prop: 'other',
      label: '其他',
      align: 'left',
      valueFormatter: (row, column, value) => (value || '--')
    },
    {
      width: 300,
      prop: 'comments',
      label: '评论',
      visible: false,
      align: 'left',
      valueFormatter: (row, column, value) => (value || '--')
    },
    {
      width: 160,
      prop: 'createTime',
      label: '创建时间',
      visible: true,
      align: 'center',
      formatter: 'dateFormate'
    },
    {
      width: 160,
      prop: 'updateTime',
      label: '更新时间',
      visible: true,
      align: 'center',
      formatter: 'dateFormate'
    },
    {
      width: 150,
      prop: 'ops',
      label: '操作',
      align: 'center',
      visible: true,
      compFormatter: 'OPS'
    }
  ]
}
