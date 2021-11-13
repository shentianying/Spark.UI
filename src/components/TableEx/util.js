import * as Utils from '@/utils/index'
import moment from 'moment'
export const formatFunc = {
  date: (text, pattern = 'YYYY-MM-DD') => text ? moment(text).format(pattern) : text,
  money: text => Utils.formatMoney(text, 2, 0)
}

export function getValueByPath(obj, path) {
  const bailRe = /[^\w.$]/
  if (typeof path !== 'string' || bailRe.test(path)) return
  const segments = path.split('.')
  for (let i = 0; i < segments.length; i++) {
    if (!obj) return
    obj = obj[segments[i]]
  }
  return obj
}
export function formatText(format, row, column, scope) {
  let res = ''
  // console.log(format, row, column)
  const val = getValueByPath(row, column.prop)
  // console.log(column, row)
  if (typeof format === 'string') {
    res = formatFunc[format] ? formatFunc[format](val) : val
  } else if (typeof format === 'function') {
    res = format(val, formatFunc, row, column, scope)
  } else {
    // console.log(column, row)
    res = val
  }
  return res
}
export default formatFunc
