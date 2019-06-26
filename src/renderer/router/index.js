import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout-page',
      redirect:'/home',
      component: require('@/components/LayoutPage').default,
      children:[
        {
          path: '/',
          name: 'home-page',
          component: () => import('@/components/views/homePage/index.vue'),
        },
        {
          path: '/songList',
          name: 'song-list-detail',
          component: () => import('@/components/views/songListDetail/index.vue'),
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
