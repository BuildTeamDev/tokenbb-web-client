import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth.store';
import categories from './categories.store';
import replies from './replies.store';
import topics from './topics.store';

Vue.use( Vuex );

export default new Vuex.Store( {
  modules: {
    auth,
    categories,
    topics,
    replies,
  },
} );
