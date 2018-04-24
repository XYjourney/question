import _ from 'lodash'
export const debounce = (func, time = 16) => {
  return _.debounce(func, time)
}
