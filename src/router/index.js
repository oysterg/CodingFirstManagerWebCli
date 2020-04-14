import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * hidden: true                   默认false，当设置 true 的时候该路由不会在侧边栏出现，如401，login等页面，或者如一些编辑页面
 * alwaysShow: true               当一个路由下面的 children声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                设置 alwaysShow为true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['superAdmin','editor'] 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             设置该路由的图标
    noCache: true                默认false，如果设置为true，则不会被 <keep-alive> 缓存
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示
}
    activeMenu: '/example/list'  如果设置了路径，在侧边栏会高亮你设置的路径
  }
 */

/**
 * constantRoutes
 * 不需要动态判断权限的路由
 * 所有角色都可以看到
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '主页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * 需要动态判断权限并通过 addRoutes 动态添加的页面
 */
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: 'noRedirect',
    name: 'User',
    meta: {
      title: '用户管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'UserList',
        component: () => import('@/views/user/UserList'),
        name: 'UserList',
        meta: { title: '用户列表', noCache: true }
      },
      {
        path: 'UserTitle',
        component: () => import('@/views/user/UserTitle'),
        name: 'UserTitle',
        meta: { title: '用户称号', noCache: true },
        hidden: true
      },
      {
        path: 'UserDetail',
        component: () => import('@/views/user/UserDetail'),
        name: 'UserDetail',
        meta: { title: '用户详情', noCache: true },
        hidden: true
      },
      {
        path: 'TitleList',
        component: () => import('@/views/user/TitleList'),
        name: 'TitleList',
        meta: { title: '称号管理', noCache: true }
      },
      {
        path: 'Verification',
        component: () => import('@/views/user/Verification'),
        name: 'Verification',
        meta: { title: '认证审核', noCache: true }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['superAdmin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'RolePermission',
        component: () => import('@/views/permission/RolePermission'),
        name: 'RolePermission',
        meta: {
          title: '角色权限',
          roles: ['superAdmin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'AdminList',
        component: () => import('@/views/permission/AdminList'),
        name: 'AdminList',
        meta: {
          title: '管理员列表',
          roles: ['superAdmin']
        }
      }
    ]
  },

  /** 路由表过长可以把它们分割成小模块 **/
  {
    path: '/problems',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Problems',
    meta: {
      title: '题库管理',
      icon: 'documentation'
    },
    children: [
      {
        path: 'LocalProblems',
        component: () => import('@/views/problems/LocalProblems'),
        name: 'LocalProblems',
        meta: { title: '本地题库', noCache: true }
      },
      {
        path: 'VJProblems',
        component: () => import('@/views/problems/VJProblems'),
        name: 'VJProblems',
        meta: { title: 'Vitual Judge题库', noCache: true }
      },
      {
        path: 'ProblemsTag',
        component: () => import('@/views/problems/ProblemsTag'),
        name: 'ProblemsTag',
        meta: { title: '题目标签', noCache: true }
      },
      {
        path: 'EditProblems',
        component: () => import('@/views/problems/EditProblems'),
        name: 'EditProblems',
        meta: { title: '修改题目', noCache: true },
        hidden: true
      },
      {
        path: 'ProblemDetail',
        component: () => import('@/views/problems/ProblemDetail'),
        name: 'ProblemDetail',
        meta: { title: '题目详情', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/mall',
    component: Layout,
    redirect: '/mall/GoodsList',
    name: 'Mall',
    meta: {
      title: '商城管理',
      icon: 'shopping'
    },
    children: [
      {
        path: 'GoodsList',
        component: () => import('@/views/mall/GoodsList'),
        name: 'GoodsList',
        meta: { title: '商品管理', noCache: true }
      },
      {
        path: 'AddGoods',
        component: () => import('@/views/mall/AddGoods'),
        name: 'AddGoods',
        meta: { title: '添加商品', noCache: true },
        hidden: true
      },
      {
        path: 'EditGoods',
        component: () => import('@/views/mall/EditGoods'),
        name: 'EditGoods',
        meta: { title: '修改商品', noCache: true },
        hidden: true
      },
      {
        path: 'OrderList',
        component: () => import('@/views/mall/OrderList'),
        name: 'OrderList',
        meta: { title: '订单管理', noCache: true }
      }
    ]
  },
  {
    path: '/contest',
    component: Layout,
    redirect: '/contest/AddContest',
    name: 'Contest',
    meta: {
      title: '比赛管理',
      icon: 'table'
    },
    children: [
      {
        path: 'PracticeContest',
        component: () => import('@/views/contest/ContestList'),
        name: 'PracticeContest',
        meta: { title: '练习赛', noCache: true }
      },
      {
        path: 'PointContest',
        component: () => import('@/views/contest/ContestList'),
        name: 'PointContest',
        meta: { title: '积分赛', noCache: true }
      },
      {
        path: 'FunContest',
        component: () => import('@/views/contest/ContestList'),
        name: 'FunContest',
        meta: { title: '趣味赛', noCache: true }
      },
      {
        path: 'FormalContest',
        component: () => import('@/views/contest/ContestList'),
        name: 'FormalContest',
        meta: { title: '正式赛', noCache: true }
      },
      {
        path: 'DIYContest',
        component: () => import('@/views/contest/ContestList'),
        name: 'DIYContest',
        meta: { title: '自定义赛', noCache: true }
      },
      {
        path: 'VerifySignUp',
        component: () => import('@/views/contest/VerifySignUp'),
        name: 'VerifySignUp',
        meta: { title: '报名审核', noCache: true }
      },
      {
        path: 'AddContest',
        component: () => import('@/views/contest/AddContest'),
        name: 'AddContest',
        meta: { title: '新增比赛', noCache: true }
      }
    ]
  },
  {
    path: '/rank',
    component: Layout,
    redirect: '/rank/HonorRank',
    name: 'Rank',
    meta: {
      title: '排名管理',
      icon: 'list'
    },
    children: [
      {
        path: 'HonorRank',
        component: () => import('@/views/rank/HonorRank'),
        name: 'HonorRank',
        meta: { title: '荣誉榜', noCache: true }
      },
      {
        path: 'ActiveRank',
        component: () => import('@/views/rank/ActiveRank'),
        name: 'ActiveRank',
        meta: { title: '活跃榜', noCache: true }
      },
      {
        path: 'UserRank',
        component: () => import('@/views/rank/UserRank'),
        name: 'UserRank',
        meta: { title: '现役榜', noCache: true }
      },
      {
        path: 'GroupRank',
        component: () => import('@/views/rank/GroupRank'),
        name: 'GroupRank',
        meta: { title: '组队榜', noCache: true }
      },
      {
        path: 'PointRank',
        component: () => import('@/views/rank/PointRank'),
        name: 'PointRank',
        meta: { title: '积分榜', noCache: true }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/judge/JudgeList',
    children: [
      {
        path: 'Judge',
        component: () => import('@/views/judge/JudgeList'),
        name: 'Judge',
        meta: { title: '评测管理', icon: 'example' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'Challenge',
        component: () => import('@/views/challenge/ChallengeList'),
        name: 'Challenge',
        meta: { title: '挑战管理', icon: 'star' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'Discussion',
        component: () => import('@/views/discussion/DiscussionList'),
        name: 'Discussion',
        meta: { title: '讨论管理', icon: 'wechat' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'form'
    },
    children: [
      {
        path: 'AddNotice',
        component: () => import('@/views/system/AddNotice'),
        name: 'AddNotice',
        meta: { title: '新增通知', noCache: true }
      },
      {
        path: 'CheckLog',
        component: () => import('@/views/system/CheckLog'),
        name: 'CheckLog',
        meta: { title: '查看Log', noCache: true }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
