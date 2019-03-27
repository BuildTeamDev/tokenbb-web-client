
import Vue from 'vue';

import App from './App.vue';

import { registerSW } from './registerServiceWorker';
import router from './router';
import store from './store/index.js';

import steemEditor from 'steem-editor';
import 'steem-editor/dist/css/index.css';
import VueAnalytics from 'vue-analytics';

import { formatDate, formatDateTimeFromNow } from './utils/content';

registerSW();

const contextMap = {
  default: { theme: 'theme-default', forum: 'support', icon: 'favicon.ico' },
  monsters: { theme: 'theme-monsters', forum: 'monsters', icon: 'themes/monsters/favicon_teeth.png' },
  drugwars: { theme: 'theme-drugwars', forum: 'drugwars', icon: 'themes/drugwars/small.png' },
  localhost: { theme: 'theme-lightmode', forum: 'test', icon: 'favicon.ico' },
};
let context = contextMap.default;
const subs = ( new URL( window.location ) ).hostname.split( '.' );
if ( contextMap.hasOwnProperty( subs[0] ) ) {
  context = contextMap[subs[0]];
} else if ( subs.length >= 2 ) {
  if ( subs[1] === 'tokenbb' ) {
    context.forum = subs[0];
  }
}
console.log( `Loading TokenBB on ${ context.forum } with ${ context.theme }` );
document.documentElement.className = `${ context.theme }`;
global.forumname = context.forum;
document.title = `TokenBB ${global.forumname}`;

const link = document.querySelector( 'link[rel*=\'icon\']' ) || document.createElement( 'link' );
link.type = 'image/x-icon';
link.rel = 'shortcut icon';
link.href = `${ process.env.VUE_APP_BASE_URL }/${ context.icon }`;
document.getElementsByTagName( 'head' )[0].appendChild( link );


Vue.config.productionTip = false;

Vue.use( VueAnalytics, {
  id: process.env.VUE_APP_GA_ID,
  router,
  autoTracking: {
    exception: true,
    exceptionLogs: true,
  },
  batch: {
    enabled: true,
    amount: 5,
    delay: 500,
  },
} );

window.setGAUserID = setGAUserID;
function setGAUserID( userID ) {
  Vue.$ga.set( 'userId', userID );
}

Vue.use( steemEditor );

Vue.filter( 'formatDate', formatDate );
Vue.filter( 'fromNow', formatDateTimeFromNow );

Vue.filter( 'usernameDisplay', ( username, owner ) => {
  if ( username === process.env.VUE_APP_ANON_USER ) {
    return `GuestUser#${owner.substring( 4, 10 )}`;
  }
  return username;
} );

new Vue( {
  router,
  store,
  render: ( h ) => h( App ),
} ).$mount( '#app' );
