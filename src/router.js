import {
  createWebHistory,
  createRouter
} from 'vue-router';
import LandingApp from './views/landing/LandingApp.vue';
import ExploreApp from './views/product/ExploreApp.vue';
import DetailApp from './views/product/DetailApp.vue';
import RequestApp from './views/request/RequestApp.vue';
import ClaimReqApp from './views/request/ClaimReqApp.vue';
import LoginApp from './views/auth/LoginApp.vue';
import RegisterApp from './views/auth/RegisterApp.vue';
import ProfileApp from './views/account/ProfileApp.vue';
import ChangePassApp from './views/account/ChangePassApp.vue';
import PolicyApp from './views/account/PolicyApp.vue';
import ClaimApp from './views/account/ClaimApp.vue';
import TransactionApp from './views/account/TransactionApp.vue';
import store from './store';

const routes = [{
    path: '/',
    component: LandingApp
  },
  {
    path: '/safari',
    component: ExploreApp
  },
  {
    path: '/abror',
    component: ExploreApp
  },
  {
    path: '/detail',
    component: DetailApp
  },
  {
    path: '/request',
    component: RequestApp,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    component: LoginApp
  },
  {
    path: '/register',
    component: RegisterApp
  },
  {
    path: '/profile',
    component: ProfileApp,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/changepass',
    component: ChangePassApp,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/policy-history',
    component: PolicyApp,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/claim-history',
    component: ClaimApp,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/transaction',
    component: TransactionApp,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/claim-req',
    component: ClaimReqApp,
    meta: {
      requiresAuth: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.isAuthenticated) {
      next();
    } else {
      try {
        await store.dispatch('refreshToken');
        if (store.state.isAuthenticated) {
          next();
        } else {
          next('/login');
        }
      } catch {
        next('/login');
      }
    }
  } else {
    next();
  }
});

export default router;