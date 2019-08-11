import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Transfer from '../components/Transfer.vue'
import Dashboard from '../components/Dashboard.vue'
import Merchants from '../components/Merchants.vue'
import CreateAPI from '../components/CreateAPI.vue'
import Reports from '../components/Reports.vue'
import Backup from '../components/Backup.vue'
import Settings from '../components/Settings.vue'
import Restore from '../components/Restore.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/transfer',
      name: 'Transfer',
      component: Transfer
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/merchants',
      name: 'Merchants',
      component: Merchants
    },
    {
      path: '/create',
      name: 'CreateAPI',
      component: CreateAPI
    },
    {
      path: '/reports',
      name: 'Reports',
      component: Reports
    },
    {
      path: '/backup',
      name: 'Backup',
      component: Backup
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/restore',
      name: 'Restore',
      component: Restore
    },
  ]
})
