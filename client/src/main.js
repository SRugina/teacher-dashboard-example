import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';

Vue.use(VueRouter);
Vue.use(BootstrapVue);

import './assets/scss/custom.scss';

import "babel-polyfill";

import auth from './auth';
import App from './App.vue';
import About from './views/About.vue';
import Dashboard from './views/Dashboard.vue';
import Pupils from './views/Pupils.vue';
import Reports from './views/Reports.vue';
import Login from './views/Login.vue';
import notFound from './views/notFound.vue';

async function requireAuth (to, from, callback) {
    if (await auth.loggedIn()) {
        callback();
    } else {
        callback({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    }
}

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '/' },
        { path: '/about', component: About },
        { path: '/dash', component: Dashboard, beforeEnter: requireAuth },
        { path: '/pupils/:id', component: Pupils, beforeEnter: requireAuth },
        { path: '/pupils/:id/report', component: Reports, beforeEnter: requireAuth },
        { path: '/login', component: Login },
        { path: '/logout',
            beforeEnter (to, from, callback) {
                auth.logout();
                callback('/');
            }
        },
        { path: '*', component: notFound }
    ]
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    // replace the content of <div id="app"></div> with App
    render: h => h(App)
});
