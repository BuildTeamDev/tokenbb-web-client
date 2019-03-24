import { Toast } from 'buefy/dist/components/toast';

import { listRoles } from '../services/api.service.js';
import { errorAlertOptions } from '../utils/notifications.js';


export default {
  namespaced: true,
  state: {
    fetching: true,
    categoryOrdering: Object,
    owners: [],
    mods: [],
  },
  mutations: {
    setFetching( state, fetching ) {
      state.fetching = fetching;
    },
    updateForum( state, forum ) {
      try {
        state.categoryOrdering = JSON.parse( forum.categoryOrdering );
      } catch ( e ) {
        console.error( `Invalid categoryOrdering JSON ${forum.categoryOrdering}: `, e );
        state.categoryOrdering = {};
      }
      state.owners = forum.owners;
      state.mods = forum.mods;
    },
  },
  getters: {
    getRoles( { owners, mods } ) {
      return {
        owners,
        mods,
      };
    },
    getCategoryOrdering( { categoryOrdering } ) {
      return categoryOrdering;
    },
  },
  actions: {
    fetch( { commit } ) {
      commit( 'setFetching', true );

      listRoles()
        .then( ( forum ) => {
          commit( 'updateForum', forum.data );
          commit( 'setFetching', false );
        } )
        .catch( ( err ) => {
          commit( 'setFetching', false );
          Toast.open( errorAlertOptions( 'Error fetching forum', err ) );
          console.error( err );
        } );
    },
  },
};
