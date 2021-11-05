import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import VueRouter from 'vue-router'

import Login from './components/Login.vue'
import SignIn from './components/SignIn.vue'
import Chat from './components/Chat.vue'
import Index from './components/Index.vue'

import store from './store/store'

import 'bootstrap'

const routes = [
  { name: 'index', path: '/', component: Index},
  { name: 'login', path: '/login', component: Login },
  { name: 'signin', path: '/singin', component: SignIn }, 
  { name: 'chat', path: '/chat', component: Chat, props: true }
]

const router = new VueRouter({
  routes
})

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')