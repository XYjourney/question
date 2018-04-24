import Vue from 'vue'
import Router from 'vue-router'
import Record from '@/pages/record'
import Login from '@/pages/Login'
import Question from '@/pages/Question'
// import Test from '@/pages/record/Ops'
import Ref from '@/pages/Reference'
Vue.use(Router)

export default new Router({
  // mode: 'history', 需要后端配置配合，暂不处理
  routes: [
    {
      path: '/reference',
      component: Ref,
      name: 'reference'
    },
    {
      path: '/',
      redirect: '/question'
    },
    {
      path: '/question',
      name: 'question',
      component: Question
    },
    {
      path: '/admin/record/list',
      name: 'record',
      component: Record,
      beforeEnter: (to, from, next) => {
        if (sessionStorage.getItem('islogin')) {
          next()
        } else {
          next({
            name: 'login'
          })
        }
      }
    },
    {
      path: '/admin/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem('islogin')) {
          next()
        } else {
          next({
            name: 'record'
          })
        }
      }
    }
  ]
})
