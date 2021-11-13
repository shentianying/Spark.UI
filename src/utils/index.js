import store from '@/store'
import router from '@/router'
import { LSGetObject } from './localstore'
/**
 * @description: 将小写金额转换成大写
 * @param {Number} n 需要转换的数值
 * @return {String} 大写金额
 */
export function amountInWords(n) {
  if (!n) return ''
  if (n.toString() === '0') return '零'
  if (!/^(\+|-)?(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '数据非法'

  var unit = '仟佰拾亿仟佰拾万仟佰拾元角分'; var str = ''
  n += '00'
  var a = parseFloat(n)
  if (a < 0) {
    n = n.substr(1)
  }
  var p = n.indexOf('.')
  if (p >= 0) {
    n = n.substring(0, p) + n.substr(p + 1, 2)
  }

  unit = unit.substr(unit.length - n.length)

  for (var i = 0; i < n.length; i++) { str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i) }
  if (a > 0) {
    return str.replace(/零(仟|佰|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元整')
  } else {
    return '负' + str.replace(/零(仟|佰|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元整')
  }
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}
/**
 * 数字转日期格式
 * @param {日期数字} numb
 * @param {分隔符} format
 */
export function formatExcelDate(numb, format = '-') {
  if (isNaN(numb)) {
    return numb
  }
  const time = new Date(new Date('1900-1-1').getTime() + (numb - 1) * 3600 * 24 * 1000)
  const year = time.getFullYear() + ''
  const month = time.getMonth() + 1 + ''
  const date = time.getDate()
  if (format && format.length === 1) {
    return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
  }
  return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function uuid(length = 32) {
  const num = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += num.charAt(Math.floor(Math.random() * num.length))
  }
  return str
}
/**
 * @returns {object} 个人设置对象
 */
export function getPersonalSettings() {
  // 默认值
  let personalSettings = {
    amountFormat: 4, // 默认万分位
    pageSize: 10 // 默认每页十条
  }
  const LSResult = LSGetObject('PersonalSettings')
  if (LSResult) {
    const { amountFormat, pageSize } = LSResult
    personalSettings = {
      amountFormat: Number(amountFormat),
      pageSize: Number(pageSize)
    }
  }
  return personalSettings
}
/**
  *格式化金额，
  * 2021年9月4日 发现当金额为负数时存在逻辑错误,会出现-,1234.12这样的
  * 现增加负数的判断,先转成正数,格式化以后再加上负号
  * @param {Number|String} s : 金额
  * @param {Number} n : 保留位数
  * @param {Number} [d=4] : 默认万分位数 ,d=0,取用户设置的值
  * @returns {String} 1,2345.11
  **/
export function formatMoney(s, n, d = 4) {
  if (d === 0) {
    const { amountFormat } = getPersonalSettings()
    d = amountFormat
  }

  n = n > 0 && n <= 20 ? n : 2
  s = Number(s)
  const Symbol = s < 0 ? '-' : ''
  s = parseFloat((Math.abs(s) + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
  var l = s.split('.')[0].split('').reverse()
  var r = s.split('.')[1]
  var t = ''
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % d === 0 && (i + 1) !== l.length ? ',' : '')
  }
  return `${Symbol}${t.split('').reverse().join('')}.${r}`
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

// 乘法
export function NumberMul(arg1, arg2) {
  var m = 0
  var s1 = arg1.toString()
  var s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  // eslint-disable-next-line no-empty
  } catch (e) {}

  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

// 加法
export function NumberAdd(arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2
  return ((arg1 * m + arg2 * m) / m).toFixed(n)
}
// 减法
export function NumberSub(arg1, arg2) {
  var re1, re2, m, n
  try {
    re1 = arg1.toString().split('.')[1].length
  } catch (e) {
    re1 = 0
  }
  try {
    re2 = arg2.toString().split('.')[1].length
  } catch (e) {
    re2 = 0
  }
  m = Math.pow(10, Math.max(re1, re2))
  n = (re1 >= re2) ? re1 : re2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}
// 除数，被除数， 保留的小数点后的位数
export function NumberDiv(arg1, arg2, digit) {
  var t1 = 0; var t2 = 0; var r1; var r2
  // eslint-disable-next-line no-empty
  try { t1 = arg1.toString().split('.')[1].length } catch (e) {}
  // eslint-disable-next-line no-empty
  try { t2 = arg2.toString().split('.')[1].length } catch (e) {}
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  // 获取小数点后的计算值
  var result = ((r1 / r2) * Math.pow(10, t2 - t1)).toString()
  var result2 = result.split('.')[1]
  result2 = result2.substring(0, digit > result2.length ? result2.length : digit)

  return Number(result.split('.')[0] + '.' + result2)
}

// 方法1。根据后台的列表数据，递归生成树形结构
export function getTree(id, data) {
  var a = data.filter(f => f.pid === id)
  var b = data.filter(f => f.pid !== id)
  a.forEach(element => {
    var arr = getTree(element.id, b)
    if (arr.length) {
      element.children = arr
    }
  })
  return a
}
// 方法2。根据后台的列表数据，递归生成树形结构
export function toTree(data) {
  const result = []
  if (!Array.isArray(data)) {
    return result
  }
  data.forEach(item => {
    delete item.children
  })
  const map = {}
  data.forEach(item => {
    map[item.id] = item
  })
  data.forEach(item => {
    const parent = map[item.pid]
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

// 递归 获取所有子节点 id 的数组
export function getTreeNode(data, arr) {
  if (data.children) {
    data.children.forEach(element => {
      arr.push(element.id)
      if (element.children) {
        getTreeNode(element, arr)
      }
    })
  }
  return arr
}

// 递归从子节点向上查找父节点
export function findPNode(arr1, id) {
  const temp = []
  const forFn = function(arr, id) {
    const pNode = arr.find(f => f.id === id)
    if (pNode) {
      temp.push(pNode)
      if (pNode.pid !== 0) { forFn(arr, pNode.pid) }
    }
  }
  forFn(arr1, id)
  return temp
}

// 获取该节点下面的所有的叶子节点
export function getLeafNodes(data, arr) {
  if (data.children) {
    data.children.forEach(element => {
      if (element.children) {
        getLeafNodes(element, arr)
      } else { arr.push(element.id) }
    })
  }
  return arr
}

// 关闭当前页面刷新列表页面
export function closeAndRefresh(refreshRouterName) {
  store.dispatch('tagsView/delView', router.history.current)
  router.push({ name: refreshRouterName, params: { refresh: true }})
}

// 计算文件大小函数(保留两位小数),Size为字节大小
// size：初始文件大小
export function getFileSize(size) {
  if (!size) { return '' }
  var num = 1024.00 // byte

  if (size < num) { return size + 'B' }
  if (size < Math.pow(num, 2)) { return (size / num).toFixed(2) + 'K' } // kb
  if (size < Math.pow(num, 3)) { return (size / Math.pow(num, 2)).toFixed(2) + 'M' } // M
  if (size < Math.pow(num, 4)) { return (size / Math.pow(num, 3)).toFixed(2) + 'G' } // G
  return (size / Math.pow(num, 4)).toFixed(2) + 'T' // T
}
/**
 *
 * @param {string} str
 */
export function cleanText(str) {
  if (typeof str === 'string') {
    const r = str.replace(/[\r\n]/g, '') // 去掉回车换行
    return r.trim()
  } else if (typeof str === 'undefined') {
    return ''
  } else { return str }
}
/**
 * 获取对象中某个属性的值 o:值 a:属性名称
 * @param {object} o 对象
 * @param {string} a 属性名
 * @param {string} d 默认返回值
 */
export function getObjectValue(o, a, d = '') {
  if (o) { return o[a] } else { return d }
}

/**
 * 去重。
 * @param {Array} arr 要去重的数组
 * @param {string} n 根据对象中的哪个名称去重
 */
// export function unique(arr, n = 'id') {
//   const res = new Map()
//   return arr.filter((arr) => !res.has(arr[n]) && res.set(arr[n], 1))
// }
export function unique(arr, n = 'id') {
  const t = []
  arr.forEach(e => {
    if (!t.some(f => f[n] === e[n])) { t.push(e) }
  })
  return t
}
/**
 * 格式化行号,不够10就补0
 * @param {Number} n 下标,从0开始
 * @returns 行号,从01开始计数
 */
export function formatIndex(n) {
  n = (n + 1).toString()
  return n[1] ? n : '0' + n
}
/**
 * 简单深拷贝,试用简单的对象和数组结构
 * @param {*} origin 拷贝对象
 * @returns 新的对象
 */
export function easyDeepClone(origin) {
  if (typeof origin === 'object') return JSON.parse(JSON.stringify(origin))
}
/**
 * 求和
 * @param  {...Number,Number[]} nums 数字或数字数组
 * @returns 和
 * @example sun(1,2,[3,4],5)
 */
export function sum(...nums) {
  const arr = [].concat(...nums)
  if (arr.length === 0) return 0
  return arr.reduce((prev, curr) => prev + curr)
}
/**
* 获取待处理人
* @param {Object} bf 流程对象
* @returns {String} 待处理人字符串
*/
export function getPerson(bf) {
  if (bf) {
    var arr = bf.billFlowNode.filter(f => f.isCurrentState && !f.isChecked)
    return arr.map(m => m.person.name).join('、')
  }
}
/**
* 判断自己是否是待处理人
*/
export function IsNextPerson(bf) {
  const arr = bf?.billFlowNode?.filter(f => f.isCurrentState && !f.isChecked) || []
  return arr.find(v => v.person.id === store.state.user.uid)
}
/**
 * 判断当前角色是否有对应权限
 * 判断方法跟自定义命令v-has是一样的,之所以写一个这个是因为v-has的逻辑是没有权限直接删除按钮,现在的需求是只想知道是否有权限,后续操作另外处理,这样更自由
 * @param {String} power-权限标识,字符串不区分大小写,对应于系统设置-权限管理-菜单权限中的标识
 * @returns {Object} 为了更加方便直接返回对应权限的权限对象,如果没有就是undefined
 */
export function hasPower(power) {
  return store?.getters?.info?.rolePermitList?.find(f => f.permit.code.toLowerCase() === power.toLowerCase())
}
