import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import Pupils from './components/Pupils.vue'
Vue.use(Router)

// https://www.adcisolutions.com/knowledge/how-build-single-page-application-spa-vuejs

const router = new Router({
 routes: [
   {
     path: '/',
     name:'dash',
     component: App,
   },
   {
     path: '/pupil/:id',
     name:'pupils',
     component: Pupils,
     props: true,
   },
 ]
})

new Vue({
 el: '#app',
 render: h => h(App),
 router
})
