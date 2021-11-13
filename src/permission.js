import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'
import { getTree } from '@/utils/index'

NProgress.configure({ showSpinner: true }) // NProgress Configuration

const whiteList = ['/login', '/transfer'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  // await getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
      // else if (to.matched.length === 0) { // 如果未匹配到路由
    //   next({ path: '/404' })
    //   NProgress.done()
    // }
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          if (store.getters.menus.length < 1) {
            global.antRouter = []
            next()
          }
          const getIsMenu = store.getters.menus // 后台所有菜单
          // ************1.用角色权限控制菜单--显示自己的菜单************
          const fm = formatMenu(getMyRolePage(getIsMenu))

          // ************2.不用角色权限控制菜单--全部显示菜单************
          // const fm = formatMenu(getIsMenu)

          var newObj = JSON.parse(JSON.stringify(fm.filter(f => f.isPage)))
          // 生成没有错误路由的的 树形菜单列表
          var noErrorList = checkRouterError(fm)
          const menus = getTree(0, noErrorList)

          newObj = newObj.filter(f => !errorIdList.includes(f.id)) // 路由中去掉错误的菜单项
          router.addRoutes(level2Router(newObj)) // 2.动态添加路由
          global.antRouter = menus // 3.将路由数据传递给全局变量，做侧边栏菜单渲染工作

          next({
            ...to,
            replace: true
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // console.log('permission.js.error')
          Message.error({ message: error || 'Has Error' })
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
// 递归从子节点向上查找父节点
function findPNode(arr1, id) {
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

// 遍历转换成二级菜单json数据
function level2Router(arr) {
  var chilrenList = []
  for (var element of arr) {
    delete element.id
    delete element.pid
    delete element.isPage
    if (element.component) {
      element.component = require('@/views' + element.component + '.vue').default
      chilrenList.push(element)
    }
  }

  var root = {}
  root.name = 'systemset'
  root.path = '/systemset'
  root.component = Layout
  root.redirect = 'noRedirect'
  // root.meta = { title: '后台管理' }
  root.children = chilrenList
  return [root, { path: '*', redirect: '/404', hidden: true }]
}

const errorIdList = [] // 错误路由的Id数组
// 检测路由是否错误，过滤掉错误的项
function checkRouterError(list) {
  list.forEach(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        try {
          route.component = require('@/views' + route.component + '.vue').default // 导入组件
        } catch (error) {
          route.component = 'del'
          errorIdList.push(route.id)
          console.error(`加载路由出错:${error}`)
        }
      }
    }
  })

  return list.filter(f => f.component !== 'del')
}

function formatMenu(menu) {
  var result = []
  menu.forEach(ele => {
    result.push({
      id: ele.id,
      pid: ele.pid,
      path: ele.routerPath,
      component: ele.routerComponent,
      redirect: ele.routerRedirect,
      name: ele.routerName,
      meta: { title: ele.routerTitle, icon: ele.routerIcon },
      hidden: ele.routerHidden,
      isPage: ele.isPage
    })
  })
  return result
}

function getMyRolePage(getIsMenu) {
  const rolePermit = store.getters.info.rolePermitList // 获取当前角色的菜单列表
  var res = []
  rolePermit.forEach(ele => {
    res.push(...findPNode(getIsMenu, ele.permit.pageId)) // 循环每个子节点，获取对应所有父节点，合并
  })
  const myRolePageList = Array.from(new Set(res)) // 去重
  myRolePageList.sort((a, b) => { // js 排序
    return a.sort - b.sort
  })
  return myRolePageList
}
