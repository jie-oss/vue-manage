import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../components/Home.vue'

const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: Home,
    redirect: '/welcome',
    children: [
      {
        name: 'welcome',
        path: 'welcome',
        meta: {
          title: '欢迎页'
        },
        component: () => import('../views/Welcome.vue'),
      },
      {
        name: 'user',
        path: '/system/user',
        meta: {
          title: '用户管理'
        },
        component: () => import('../views/User.vue'),
      },
      {
        name: 'menu',
        path: '/system/menu',
        meta: {
          title: '菜单管理'
        },
        component: () => import('../views/Menu.vue'),
      },
      {
        name: 'role',
        path: '/system/role',
        meta: {
          title: '角色管理'
        },
        component: () => import('../views/Role.vue'),
      },
      {
        name: 'dept',
        path: '/system/dept',
        meta: {
          title: '部门管理'
        },
        component: () => import('../views/Dept.vue'),
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录页'
    },
    component: () => import('../views/Login.vue'),
  },
  {
    name: '404',
    path: '/404',
    meta: {
      title: '404页面'
    },
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

function checkPermission(path) {
  let hasPermission = router.getRoutes().filter(route => route.path == path).length
  if (hasPermission) {
    return true
  } else {
    return false
  }
}

router.beforeEach((to, from, next) => {
  if (checkPermission(to.path)) {
    document.title = to.meta.title
    next()
  } else {
    next('/404')
  }
})

export default router