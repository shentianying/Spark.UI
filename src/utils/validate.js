/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * vue验证函数
 * import { validate } from '@/utils/validate'
 * 使用：
 * { validator: validate.dbl }
 * { validator: validate.dbl, message: '可为空或数字类型', required: false }
 * { validator: validate.logic, logic: value => value > 0 && value < 1 }
 * { validator: validate.regex, regex: /^\d+$/ }
 */
export var validate = {
  required: (rule, value, callback) => validateFunction('required', rule, value, callback),
  phone: (rule, value, callback) => validateFunction('phone', rule, value, callback),
  mobile: (rule, value, callback) => validateFunction('mobile', rule, value, callback),
  email: (rule, value, callback) => validateFunction('email', rule, value, callback),
  url: (rule, value, callback) => validateFunction('url', rule, value, callback),
  number: (rule, value, callback) => validateFunction('number', rule, value, callback),
  qq: (rule, value, callback) => validateFunction('qq', rule, value, callback),
  int: (rule, value, callback) => validateFunction('int', rule, value, callback),
  dbl: (rule, value, callback) => validateFunction('dbl', rule, value, callback),
  date: (rule, value, callback) => validateFunction('date', rule, value, callback),
  money: (rule, value, callback) => validateFunction('money', rule, value, callback),
  max_amount: (rule, value, callback) => validateFunction('max_amount', rule, value, callback),
  idCode: (rule, value, callback) => validateFunction('idCode', rule, value, callback),
  regex: (rule, value, callback) => validateFunction('regex', rule, value, callback),
  logic: (rule, value, callback) => validateFunction('logic', rule, value, callback)
}

/**
 *  js数据验证
 * import { validateData } from '@/utils/validate'
 * 使用（返回布尔型）：
 * validateData.dbl(value)
 * 数据可为空
 * validateData.null_dbl(value)
 * 正则验证
 * validateData.regex(value, /^\d+$/)
 * 逻辑验证
 * validateData.logic(value, value => value > 0 && value < 1)
 */
export var validateData = {
  required: value => validateDataFunction('required', true, value),
  phone: value => validateDataFunction('phone', true, value),
  mobile: value => validateDataFunction('mobile', true, value),
  email: value => validateDataFunction('email', true, value),
  url: value => validateDataFunction('url', true, value),
  number: value => validateDataFunction('number', true, value),
  qq: value => validateDataFunction('qq', true, value),
  int: value => validateDataFunction('int', true, value),
  dbl: value => validateDataFunction('dbl', true, value),
  date: value => validateDataFunction('date', true, value),
  money: value => validateDataFunction('money', true, value),
  max_amount: value => validateDataFunction('max_amount', true, value),
  idCode: value => validateDataFunction('idCode', true, value),
  regex: (value, regex) => validateDataFunction('regex', true, value, regex),
  logic: (value, func) => validateDataFunction('logic', true, value, func),
  null_phone: value => validateDataFunction('phone', false, value),
  null_mobile: value => validateDataFunction('mobile', false, value),
  null_email: value => validateDataFunction('email', false, value),
  null_url: value => validateDataFunction('url', false, value),
  null_number: value => validateDataFunction('number', false, value),
  null_qq: value => validateDataFunction('qq', false, value),
  null_int: value => validateDataFunction('int', false, value),
  null_dbl: value => validateDataFunction('dbl', false, value),
  null_date: value => validateDataFunction('date', false, value),
  null_money: value => validateDataFunction('money', false, value),
  null_max_amount: value => validateDataFunction('max_amount', false, value),
  null_idCode: value => validateDataFunction('idCode', false, value),
  null_regex: (value, regex) => validateDataFunction('regex', false, value, regex),
  null_logic: (value, func) => validateDataFunction('logic', false, value, func)
}

function validateDataFunction(type, required, value) {
  // 错误提示信息
  const errMsg = validateErrMsg[type]

  var result
  // 数据为空且可为空时直接验证通过
  if (!required && value.trim() === '') {
    result = true
  } else {
    switch (type) {
      case 'idCode': // 身份证验证
        result = checkIdCode(value) === '1'
        break
      case 'regex': // 正则验证
        if (arguments.length >= 4) {
          result = arguments[3].test(value)
        } else {
          result = false
          alert('未设置正则表达式')
        }
        break
      case 'logic': // 逻辑验证
        if (arguments.length >= 4) {
          result = arguments[3](value)
        } else {
          result = false
          alert('未设置验证方法')
        }
        break
      default: // 其他指定的验证方式
        if (validateReg.hasOwnProperty(type)) {
          result = validateReg[type].test(value)
        } else {
          result = false
          alert('未知的验证方法')
        }
        break
    }
  }
  // alert(errMsg)
  return { isSuccess: result, msg: errMsg }
}

function validateFunction(type, rule, value, callback) {
  let required = true

  if (rule.hasOwnProperty('required')) required = rule.required
  // 数据为空且可为空时直接验证通过
  if (!required && (value === null || value.trim() === '')) {
    callback()
    return
  }

  // 错误提示信息
  const errMsg = rule.message || validateErrMsg[type]
  switch (type) {
    case 'idCode': // 身份证验证
      if (checkIdCode(value) === '1') { callback() } else { callback(new Error(errMsg)) }
      break
    case 'regex': // 正则验证
      if (rule.hasOwnProperty('regex') && rule.regex.constructor === RegExp) {
        if (rule.regex.test(value)) { callback() } else { callback(new Error(errMsg)) }
      } else {
        callback(new Error('未设置正则表达式'))
      }
      break
    case 'logic': // 逻辑验证
      if (rule.hasOwnProperty('logic') && rule.logic.constructor === Function) {
        if (rule.logic(value)) { callback() } else { callback(new Error(errMsg)) }
      } else {
        callback(new Error('未设置验证方法'))
      }
      break
    default: // 其他指定的验证方式
      if (validateReg.hasOwnProperty(type)) {
        if (validateReg[type].test(value)) { callback() } else { callback(new Error(errMsg)) }
      } else {
        callback(new Error('未知的验证方法'))
      }
      break
  }
}

var validateErrMsg = {
  required: '不能为空',
  phone: '电话或手机号不正确',
  mobile: '手机号不正确',
  email: 'Email格式不正确',
  url: '必须为网址格式',
  money: '必须为数字格式',
  max_amount: '超过所能存储的最大金额',
  number: '必须为数字格式',
  qq: 'QQ号码不正确',
  int: '必须为整数格式',
  dbl: '必须为数字格式',
  date: '日期格式不正确',
  idCode: '身份证号码不正确',
  logic: '数据不正确',
  regex: '数据不合规则'
}

var validateReg = {
  required: /.+/,
  phone: /^((((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(-\d{1,4})?)|(0?1[3-9]\d{9}))$/, // 电话可兼容手机号码
  mobile: /^0?1[3-9]\d{9}$/,
  email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
  url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
  money: /^\d+(\.\d+)?$/,
  max_amount: /^(0\.(?!0+$)\d{1,4}|^[0-9][0-9]{0,13}(\.\d{0,4})?)$/, // 最大金额校验decimal(18, 4),总计18位,小数点后4位
  number: /^\d+$/,
  qq: /^[1-9]\d{4,10}$/,
  int: /^[-\+]?\d+$/,
  dbl: /^[-\+]?\d+(\.\d+)?$/,
  date: /^\d{4}[-\/]((0?[1-9])|(1[0-2]))[-\/]((0?[1-9])|([1-2][0-9])|(3[0-1]))$/
}

function checkIdCode(idCode) {
  var Errors = [
    '1',
    '身份证号码位数不对！',
    '身份证号码出生日期超出范围或含有非法字符！',
    '身份证号码校验错误！',
    '身份证地区非法！'
  ]
  var area = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }
  var Y, JYM
  var S, M
  var idCode_array = idCode.split('')
  var ereg
  // 地区检验
  if (area[parseInt(idCode.substr(0, 2))] === null) return Errors[4]
  // 身份号码位数及格式检验
  switch (idCode.length) {
    case 15:
      if ((parseInt(idCode.substr(6, 2), 10) + 1900) % 400 === 0 || ((parseInt(idCode.substr(6, 2), 10) + 1900) % 100 !== 0 && (parseInt(idCode.substr(6, 2), 10) + 1900) % 4 === 0)) {
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/// 测试出生日期的合法性
      } else {
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/// 测试出生日期的合法性
      }
      if (ereg.test(idCode)) return Errors[0]
      else return Errors[2]
    case 18:
      // 18位身份号码检测
      // 出生日期的合法性检查
      // 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
      // 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
      if (parseInt(idCode.substr(6, 4)) % 400 === 0 || (parseInt(idCode.substr(6, 4)) % 100 !== 0 && parseInt(idCode.substr(6, 4)) % 4 === 0)) {
        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/// 闰年出生日期的合法性正则表达式
      } else {
        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/// 平年出生日期的合法性正则表达式
      }
      if (ereg.test(idCode)) { // 测试出生日期的合法性
        // 计算校验位
        S = (parseInt(idCode_array[0]) + parseInt(idCode_array[10])) * 7 +
                  (parseInt(idCode_array[1]) + parseInt(idCode_array[11])) * 9 +
                  (parseInt(idCode_array[2]) + parseInt(idCode_array[12])) * 10 +
                  (parseInt(idCode_array[3]) + parseInt(idCode_array[13])) * 5 +
                  (parseInt(idCode_array[4]) + parseInt(idCode_array[14])) * 8 +
                  (parseInt(idCode_array[5]) + parseInt(idCode_array[15])) * 4 +
                  (parseInt(idCode_array[6]) + parseInt(idCode_array[16])) * 2 +
                  parseInt(idCode_array[7]) * 1 +
                  parseInt(idCode_array[8]) * 6 +
                  parseInt(idCode_array[9]) * 3
        Y = S % 11
        M = 'F'
        JYM = '10X98765432'
        M = JYM.substr(Y, 1)// 判断校验位
        if (M === idCode_array[17].toUpperCase()) return Errors[0] // 检测ID的校验位
        else return Errors[3]
      } else return Errors[2]
    default:
      return Errors[1]
  }
}
