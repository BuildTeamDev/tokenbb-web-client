import Vue from 'vue';
import Buefy from 'buefy';
import moment from 'moment';

import App from './App.vue';
import router from './router';
import store from './store/index.js';

import sanitize from './plugins/sanitize.js';
import toaster from './plugins/toast-notification.js';
import theme from './plugins/register-theme.js';
import { registerSW } from './registerServiceWorker';

registerSW();

Vue.config.productionTip = false;

Vue.use( Buefy );
Vue.use( sanitize );
Vue.use( toaster );
Vue.use( theme );

Vue.filter( 'formatDate', ( value ) => {
  if ( value ) {
    return moment.utc( String( value ) ).format( 'MMM Do YYYY' );
  }
} );

Vue.filter( 'fromNow', ( value ) => {
  if ( value ) {
    return moment.utc( String( value ) ).fromNow();
  }
} );

new Vue( {
  router,
  store,
  render: ( h ) => h( App ),
} ).$mount( '#app' );
