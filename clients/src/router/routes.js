import AuthLayout from '../layouts/AuthLayout.vue'
import MainLayout from '../layouts/MainLayout.vue'

import NotFound from '../pages/ErrorNotFound.vue'

import Statistic from '../pages/Statistic.vue'
import DataEdit from '../pages/DataEdits.vue'
import TechSupp from '../pages/TechSupport.vue'
import Profile from '../pages/Profile.vue'

import Login from '../components/Login_C.vue'
import Register from '../components/Registr_C.vue'
import VueCookies from "vue-cookies";

import Map from '../components/Map.vue'
import MapInner from '../components/MapInsert.vue'


const routes = [{
    path: '/map',
    component: Map,
    name: 'map',
  }, {

    path: '/auth',
    component: AuthLayout,
    name: 'auth',
    children: [{
        path: 'login',
        name: 'login',
        component: Login
      },
      {
        path: 'registr',
        name: 'registr',
        component: Register
      },

    ]
  },
  {
    path: '/',
    component: MainLayout,
    children: [{
        path: 'statistic',
        name: 'statistic',
        component: Statistic
      },
      {
        path: 'dataedit',
        name: 'dataedit',
        component: DataEdit
      },
      {
        path: 'techsupport',
        name: 'techsupport',
        component: TechSupp
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile
      },
      {
        path: '/schoolmap',
        component: MapInner,
        name: 'map_inside',
      }
    ],
    beforeEnter: (to, from) => {
      if (!VueCookies.get('token') && to.name !== 'auth') {
        return {
          name: 'auth'
        }
      }

    },
    beforeUpdate(to, from) {
      if (!VueCookies.get('token') && to.name !== 'auth') {
        return {
          name: 'auth'
        }
      }
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: NotFound
  }
]

export default routes
