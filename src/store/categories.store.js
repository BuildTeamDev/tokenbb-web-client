/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Toast } from 'buefy/dist/components/toast';
import { findIndex, forEach } from 'lodash';

import { addCategory, listCategories, removeCategory } from '../services/api.service';
import { errorAlertOptions } from '../utils/notifications.js';

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
      const index = findIndex( state.categoryList, [ '_id', category._id ] );
      delete state.categoriesById[category._id];
      state.categoryList.splice( index, 1 );
    },
    updateCategoryList( state, categories ) {
      state.categoryList = categories;
      forEach( categories, ( category ) => {
        state.categoriesById[category._id] = category;
      } );

      // For Vue Reactivity.
      state.categoriesById = { ...state.categoriesById };
    },
  },
  actions: {
    add( { commit }, { name: categoryName, title, description } ) {
      commit( 'setFetching', true );

      addCategory( categoryName, title, description )
        .then( ( category ) => {
          commit( 'add', category.data );
          commit( 'setFetching', false );
        } )
        .catch( ( err ) => {
          commit( 'setFetching', false );
          Toast.open( errorAlertOptions( `Error adding category ${categoryName}`, err ) );
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
          Toast.open( errorAlertOptions( `Error removing category ${category.name}`, err ) );
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
          Toast.open( errorAlertOptions( 'Error fetching categories', err ) );
          console.error( err );
        } );
    },
  },
};
