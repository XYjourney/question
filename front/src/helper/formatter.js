import moment from 'moment-timezone'
export const formatters = {
  percentage: _ => {
    if (_ === null || _ === undefined) {
      return '--'
    } else {
      return (+_ * 100).toFixed(2) + '%'
    }
  },

  // dateFormate: _ => _.replace(/(\S+)T(\S+)\.(\S+)/, '$1 <span style="color:#9e9e9e;">$2</span>'),
  dateFormate: _ => moment(_).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
}
