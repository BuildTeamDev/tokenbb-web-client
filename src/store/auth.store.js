import jwtdecode from 'jwt-decode';
import steem from '@/services/steem.service';
import { listRoles } from '../services/api.service.js';

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
      state.user = user;
      state.id = jwtdecode( user ).user_id;
      if ( !user ) {
        state.accounts = [];
        state.current = 'anon';
      } else {
        steem.token = user;
      }
      state.manageLink = window.BTSSO.getAccountManageLink();
      state.addLink = window.BTSSO.addSteemAccount;
    },
    setUsername( state, username ) {
      state.username = username;
    },
    setCurrent( state, username ) {
      state.current = username;
      console.log( state.current );
    },
    setRoles( state, { mod, admin } ) {
      state.mod = mod;
      state.admin = admin;
    },
    setLevel( state, level ) {
      state.level = level;
    },
    setAccounts( state, accounts ) {
      state.accounts = accounts.map( ( account ) => account.account );
      const current = state.accounts[0] || 'anon';
      console.log( `Using first account ${current}` );
      state.current = current;
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
          console.error( err );
        } );
    },
  },
  notifications: {
    showLoginError: { // You can have any name you want instead of 'showLoginError'
      title: 'Login Failed',
      message: 'Failed to authenticate',
      type: 'error', // You also can use 'VueNotifications.types.error' instead of 'error'
    },
  },
};
