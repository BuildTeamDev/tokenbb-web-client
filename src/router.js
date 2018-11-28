import Vue from 'vue';
import Router from 'vue-router';

Vue.use( Router );

const router = new Router( {
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import( './views/Home.vue' ),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import( './views/Settings.vue' ),
    },
    {
      path: '/create-forum',
      name: 'create-forum',
      component: () => import( './views/NewForum.vue' ),
    },
    {
      path: '/new',
      name: 'new-topic',
      component: () => import( './views/NewTopic.vue' ),
    },
    {
      path: '/topics/:author/:permlink',
      name: 'topic',
      component: () => import( './views/Topic.vue' ),
    },
    {
      path: '/404',
      name: 'not-found',
      component: () => import( './views/NotFound.vue' ),
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
} );

export default router;
