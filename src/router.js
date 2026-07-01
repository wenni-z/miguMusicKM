import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '/',
    redirect: { name: 'home' }, // Redirect root to 'home'
  },
  {
    name: 'home',
    path: '/home', // Explicitly define the path for the 'home' route
    component: () => import('./view/Home'),
  },
  // {
  //   name: 'info',
  //   path: '/info', // Explicit path for 'info' route
  //   component: () => import('./view/info'),
  // },
  {
    name: 'rule',
    path: '/rule', // Explicit path for 'rule' route
    component: () => import('./view/rule'),
  },
  {
    name: 'success',
    path: '/success', // Explicit path for 'success' route
    component: () => import('./view/Success'),
  },
  {
    name: 'spcl',
    path: '/spcl', // Explicit path for 'spcl' route
    component: () => import('./view/spcl'),
  },
  {
    name: 'qzvideo',
    path: '/qzvideo', // Explicit path for 'qzvideo' route
    component: () => import('./view/qzvideo'),
  },
  {
    name: 'mgMusicKMgd',
    path: '/mgMusicKMgd', // Explicit path for 'mgMusicKMgd' route
    component: () => import('./view/mgMusicKMgd'),
  },
];

const router = new Router({
  mode: 'history',
  base: '/miguMusicKM/', // Ensure the base matches your hosting path
  routes,
});

export { router };
