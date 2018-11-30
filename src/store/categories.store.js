import {} from '@/services/api.service';
import { addCategory, listCategories, removeCategory } from '../services/api.service.js';

export default {
  namespaced: true,
  state: {
    fetching: true,
    categoryList: [],
    categoriesById: {},
  },
  mutations: {
    setFetching( state, fetching ) {
      state.fetching = fetching;
    },
    add( state, category ) {
      state.categoryList.push( category );
    },
    remove( state, category ) {
      const index = state.categoryList.findIndex( ( c ) => c._id === category._id );
      delete state.categoriesById[category._id];
      state.categoryList.splice( index, 1 );
    },
    updateCategoryList( state, categories ) {
      state.categoryList = categories;
      categories.forEach( ( category ) => {
        state.categoriesById[category._id] = category;
      } );
    },
  },
  actions: {
    add( { commit }, { name: categoryName, title, description } ) {
      commit( 'setFetching', true );

      addCategory( categoryName, title, description )
        .then( ( category ) => {
          commit( 'add', category );
          commit( 'setFetching', false );
        } )
        .catch( ( err ) => {
          commit( 'setFetching', false );

          console.error( err );
        } );
    },
    remove( { commit }, category ) {
      commit( 'setFetching', true );

      removeCategory( category.name )
        .then( () => {
          commit( 'remove', category );
          commit( 'setFetching', false );
        } )
        .catch( ( err ) => {
          commit( 'setFetching', false );

          console.error( err );
        } );
    },
    fetchAll( { commit } ) {
      commit( 'setFetching', true );

      listCategories()
        .then( ( categories ) => {
          commit( 'updateCategoryList', categories.data );
          commit( 'setFetching', false );
        } )
        .catch( ( err ) => {
          commit( 'setFetching', false );

          console.error( err );
        } );
    },
  },
};
