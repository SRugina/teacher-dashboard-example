import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
import "babel-polyfill";

import auth from './auth'
import App from './App.vue'
import About from './components/About.vue'
import Dashboard from './components/Dashboard.vue'
import Login from './components/Login.vue'
import notFound from './components/notFound.vue'

function requireAuth (to, from, callback) {
  if (!auth.loggedIn()) {
    callback({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    callback()
  }
}

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/' },
    { path: '/about', component: About },
    { path: '/dash', component: Dashboard, beforeEnter: requireAuth },
    { path: '/login', component: Login },
    { path: '/logout',
      beforeEnter (to, from, callback) {
        auth.logout()
        callback('/')
      }
    },
    { path: '*', component: notFound }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  auth,
  router,
  // replace the content of <div id="app"></div> with App
  render: h => h(App)
})

export {store};
