import steem from '@/services/steem.service';
import jwtdecode from 'jwt-decode';
import { listRoles } from '../services/api.service.js';
import { errorAlertOptions } from '../utils/notifications.js';
import { Toast } from 'buefy/dist/components/toast';

export default {
  namespaced: true,
  state: {
    username: '',
    user: '',
    id: '',
    accounts: [],
    level: '',
    roles: {
      admin: false,
      mod: false,
    },
    current: 'anon',
    manageLink: '',
    addLink: '',
    autoMode: '',
  },
  mutations: {
    init( state, store ) {
      window.BTSSO.init( {
        product: 'tokenbb',
      } );
      window.BTSSO.on( 'user', ( user ) => {
        store.commit( 'auth/setUser', user );
        store.dispatch( 'auth/fetchRoles' );
      } );
      window.BTSSO.on( 'username', ( username ) => {
        store.commit( 'auth/setUsername', username );
      } );
      window.BTSSO.on( 'level', ( level ) => {
        store.commit( 'auth/setLevel', level );
      } );
      window.BTSSO.on( 'accounts', ( accounts ) => {
        store.commit( 'auth/setAccounts', accounts );
      } );
      window.BTSSO.on( 'error', ( e ) => {
        console.error( e );
      } );
      window.BTSSO.on( 'needsSetup', () => {
        window.BTSSO.setup();
      } );
    },
    addSteemAccount() {
      window.BTSSO.addSteemAccount();
    },
    logout( state ) {
      state.username = '';
      window.BTSSO.logout();
    },
    toggleAccountModal() {
      window.BTSSO.modal();
    },
    setUser( state, user ) {
      if ( !user ) {
        state.user = '';
        state.username = '';
        state.accounts = [];
        return;
      }
      state.user = user;
      try {
        state.id = jwtdecode( user ).user_id;
      } catch ( decodeError ) {
        console.error( 'Could not decode auth token, logging out!', decodeError );
        window.BTSSO.logout();
        return;
      }
      if ( !user ) {
        state.accounts = [];
        state.current = 'anon';
        window.setGAUserID();
      } else {
        steem.token = user;
        window.setGAUserID( state.id );
      }
      state.manageLink = window.BTSSO.getAccountManageLink();
      state.addLink = window.BTSSO.addSteemAccount;
      state.autoMode = () => {
        console.log( state );
        const json = JSON.stringify( {
          'account': state.current,
          'referrer': 'buildteam',
          'auto': 'true',
        } );
        window.steem_keychain.requestCustomJson( state.current, 'minnowbooster.settings', 'Posting', json, 'Enable MB Auto Mode',
          ( response ) => {
            console.log( response );
          } );

      };
    },
    setUsername( state, username ) {
      state.username = username;
    },
    setCurrent( state, username ) {
      state.current = username;
      window.BTSSO.rememberSteemAccountForApp( `${global.forumname}.tokenbb`, username );
    },
    setRoles( state, { mod, admin } ) {
      state.roles.mod = mod;
      state.roles.admin = admin;
    },
    setLevel( state, level ) {
      state.level = level;
    },
    setAccounts( state, accounts ) {
      state.accounts = accounts;

      const saved = window.BTSSO.getSteemAccountForApp( `${global.forumname}.tokenbb` );
      if ( state.accounts.filter( ( account ) => account.account === saved && account.authority.posting ).length > 0 ) {
        state.current = saved;
        console.log( `Using saved account ${ saved }` );
      } else {
        const first = state.accounts.filter( ( account ) => account.authority.posting )[0];
        const current = first ? first.account : 'anon';
        console.log( `Using first account ${ current }` );
        state.current = current;
        window.BTSSO.rememberSteemAccountForApp( `${global.forumname}.tokenbb`, current );
      }
    },
  },
  computed: {
    decoded() {
      try {
        return jwtdecode( this.user );
      } catch ( e ) {
        return null;
      }
    },
    loading() {
      return this.user === false;
    },
    authenticated() {
      return Boolean( this.user );
    },
  },
  actions: {
    fetchRoles( { commit, state } ) {
      listRoles()
        .then( ( forum ) => {
          const isAdmin = forum.data.owners.includes( state.id );
          const isMod = isAdmin || forum.data.mods.includes( state.id );
          commit( 'setRoles', { admin: isAdmin, mod: isMod } );
        } )
        .catch( ( err ) => {
          Toast.open( errorAlertOptions( `Error fetching roles: ${err.message}`, err ) );
          console.error( err );
        } );
    },
  },
};
