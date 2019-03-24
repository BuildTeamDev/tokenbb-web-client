import { Toast } from 'buefy/dist/components/toast';

import { addCategory, listCategories, removeCategory } from '../services/api.service';
import { errorAlertOptions } from '../utils/notifications.js';

import map from 'lodash/map';

export default {
  namespaced: true,
  state: {
    fetching: true,
    categoryList: [],
    categoriesById: {},
    categoriesByBreadcrumb: null,
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
      const categoriesBySlug = {};
      categories.forEach( ( category ) => {
        state.categoriesById[category._id] = category;
        categoriesBySlug[category.slug] = category;
      } );

      const categoryOrdering = this.getters['forum/getCategoryOrdering'];

      function stringToSlug( inputStr ) {
        let str = String( inputStr );
        str = str.trim();
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;';
        const to = 'aaaaaaeeeeiiiioooouuuunc------';

        for ( let i = 0, l = from.length; i < l; i++ ) {
          str = str.replace( new RegExp( from.charAt( i ), 'g' ), to.charAt( i ) );
        }

        return str
          .replace( /[^a-z0-9 -]/g, '' ) // remove invalid chars
          .replace( /\s+/g, '-' ) // collapse whitespace and replace by -
          .replace( /-+/g, '-' ) // collapse dashes
          .replace( /^-+/, '' ) // trim - from start of text
          .replace( /-+$/, '' ) // trim - from end of text
          .substring( 0, 24 );
      }

      const categoryGroupsByNav = {};
      function processCategoryOrdering( ordering, nav = '' ) {
        const slug = stringToSlug( ordering.slug );
        const currentNav = nav + ( nav !== '' ? '/' : '' ) + slug;
        const categoryGroup = { name: ordering.name, nav: currentNav };
        categoryGroupsByNav[currentNav] = categoryGroup;
        categoryGroup.groups = map( ordering.groups, ( g ) => {
          return processCategoryOrdering( g, currentNav );
        } );
        categoryGroup.categories = map( ordering.categories, ( c ) => {
          const found = categoriesBySlug[c];
          if ( found ) {
            found.nav = currentNav;
            categoriesBySlug[c] = null;
          }
          return found;
        } ).filter( ( c ) => c );
        return categoryGroup;
      }

      let homeCategory = {
        name: 'Home',
        nav: 'home',
        slug: 'home',
        groups: [],
        categories: [],
      };

      // when getter not ready, categoryOrdering is a function
      if ( categoryOrdering && typeof categoryOrdering === 'object' ) {
        if ( Array.isArray( categoryOrdering ) ) {
          homeCategory.groups = categoryOrdering;
          homeCategory = processCategoryOrdering( homeCategory );
        } else {
          homeCategory = processCategoryOrdering( categoryOrdering );
        }
      }

      // Place other categories on root level.
      homeCategory.categories = Object.values( categoriesBySlug )
        .filter( ( c ) => c )
        .map( ( c ) => {
          c.nav = 'home';
          return c;
        } );
      homeCategory.categoryGroupsByNav = categoryGroupsByNav;

      state.categoriesByBreadcrumb = homeCategory;

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
