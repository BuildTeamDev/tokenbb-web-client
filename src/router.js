import Vue from 'vue';
import Router from 'vue-router';

function loadView( view ) {
  return () => import( /* webpackChunkName: "view-[request]" */ `@/views/${view}.vue` );
}

// xwebpackPrefetch: true
Vue.use( Router );

const router = new Router( {
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: loadView( 'Home' ),
    },
    {
      path: '/settings',
      name: 'settings',
      component: loadView( 'Settings' ),
    },
     {
      path: '/categories',
      name: 'categories',
      component: loadView( 'Categories' ),
    },
    {
      path: '/create-forum',
      name: 'create-forum',
      component: loadView( 'NewForum' ),
    },
    {
      path: '/new',
      name: 'new-topic',
      component: loadView( 'NewTopic' ),
    },
    {
      path: '/topics/:author/:permlink',
      name: 'topic',
      component: loadView( 'Topic' ),
    },
    {
      path: '/404',
      name: 'not-found',
      component: loadView( 'NotFound' ),
    },
    {
      path: '*',
      name: 'wildcard-unmatched',
      redirect: '/404',
    },
  ],
} );

export default router;
