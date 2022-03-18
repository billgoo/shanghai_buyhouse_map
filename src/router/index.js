import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CoordPickerView from '../views/CoordPickerView.vue'
import NewHouseView from '../views/NewHouseView.vue'
import RawAmapView from '../views/RawAmapView.vue'
import ExternalView from '../views/ExternalView.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  // base: import.meta.env.BASE_URL,
  base: "/",  // use for production env
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: 'coordPicker',
          name: 'CoordPicker',
          component: CoordPickerView
        },
        {
          path: 'firstNew',
          name: 'FirstNew',
          component: NewHouseView
        },
        {
          path: 'secondNew',
          name: 'SecondNew',
          component: NewHouseView
        },
        {
          path: 'custom',
          name: 'CustomTest',
          component: NewHouseView
        },
        {
          path: 'rawAmap',
          name: 'RawAmap',
          component: RawAmapView
        },
        {
          path: 'gaode',
          name: 'Gaode',
          component: ExternalView,
          meta: {
            link: 'https://gaode.com/'
          },
        },
        {
          path: 'test',
          name: 'Test',
          component: NewHouseView
        },
        {
          path: 'about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to)
  next()
})

router.afterEach((to, from) => {
  // 关闭加载进度条
  // if (to.matched[to.matched.length - 1].name === 'Error') {
  //   iView.LoadingBar.error()
  // } else {
  //   iView.LoadingBar.finish()
  // }
})

export default router
