const { readFile, mkdir, writeFile } = require('fs/promises')
const { run } = require('runjs')
const axios = require('../utils/request')
const semver = require('semver')

const minVerson = '12.0.1' // 最小node版本号
const rootDir = process.cwd() // 获取项目的根目录

// 传进来的命令,指向一个目录
const { path } = require('minimist')(process.argv.slice(2))
if (!path || typeof path !== 'string') throw new Error('命令输入不正确,请输入你想要创建的路径')
const regexp = new RegExp(`${path}`)

const init = async() => {
  const verson = process.version
  if (semver.lt(verson, minVerson)) throw new Error(`当前node版本号小于最低要求${minVerson},请先升级node版本`)
  console.info(`开始获取token`)
  const { token } = await login()
  const tokenScheme = 'Bearer ' + token
  console.info(`token获取成功`, `\n开始获取路由列表`)
  const routes = await getList(tokenScheme)
  console.info(`获取路由列表成功: 总计${routes?.length}个`)
  const pages = routes.filter(v => v.isPage && regexp.test(v.routerComponent))
  console.info(`符合条件的页面路由: 总计${pages?.length}个`)
  if (!pages?.length) throw new Error('没有获取到符合条件的路由')
  try {
    console.info('检查是否有未提交commit的文件')
    run(`git add ${rootDir}`)
    run(`git commit -m "自动化脚本安全措施: 保存"`)
  } catch (err) {
    console.info('没有未提交的文件,继续执行')
  }
  console.info('开始遍历各路由')
  const created = []
  for (const { routerComponent, routerName, routerTitle } of pages) {
    const path = `${rootDir}/src/views${routerComponent}`
    const filePosition = path.lastIndexOf('/')
    const dir = path.substring(0, filePosition)
    let file = path.substring(filePosition)
    if (!/\./.test(file)) file += '.vue'
    const target = await readFile(dir + file, 'utf8').catch(() => false)
    if (target) {
      continue
    } else {
      await mkdir(dir, { recursive: true }).catch(err => new Error('目录创建失败:\n', err))
      await writeFile(dir + file, templete(routerName, routerTitle), 'utf8').catch(err => new Error('文件创建失败:\n', err))
      created.push(`${routerTitle}: ${routerComponent}`)
    }
  }
  console.info(`自动化创建已结束,本次共创建文件 ${created.length} 个\n`, created)
}

init()

/**
 * 登录
 */
function login() {
  return axios.post(`/api/xtgl/user/login`, {
    number: '100001', password: '666666'
  }).catch(err => {
    throw new Error(`登陆失败: \n${err}`)
  })
}
/**
 * 获取路由所有
 */
function getList(token) {
  return axios.get('/api/xtgl/Page/GetList', {
    headers: {
      'Authorization': token
    }
  }).catch(err => {
    throw new Error(`路由列表获取失败: \n${err}`)
  })
}
/**
 * 初始化的文件模板
 * @param {*} name vue component name
 * @param {*} title 页面标题
 * @returns String
 */
function templete(name, title) {
  return `<template>
  <div>${title}</div>
</template>

<script>
export default {
  name: '${name}'
}
</script>

<style lang="scss" scoped>

</style>
`
}
