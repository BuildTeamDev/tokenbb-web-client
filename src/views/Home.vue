<template>
  <div class="container home">
    <div class="level-left">
      <Breadcrumb :crumbs="queryCategoriesByBreadcrumb.breadcrumb" />
    </div>
    <div class="level-left all-cat">
      <router-link :to="{ path: '/topic-list' }">
        <small>Show All Topics</small>
      </router-link>
    </div>
    <CategoryList
      :categories-by-breadcrumb="queryCategoriesByBreadcrumb.categoriesByBreadcrumb"
      :fetching="fetching"
    />
  </div>
</template>

<script>

import { mapState } from 'vuex';

import Breadcrumb from '../components/Breadcrumb.vue';
import CategoryList from '../components/CategoryList.vue';

export default {
  name: 'Home',
  components: {
    Breadcrumb,
    CategoryList,
  },
  computed: {
    ...mapState( 'categories', [
      'categoriesByBreadcrumb',
      'fetching',
    ] ),
    queryCategoriesByBreadcrumb() {
      let categoriesByBreadcrumb = this.categoriesByBreadcrumb;
      const breadcrumb = [];
      const queryNav = this.$route.query.nav;
      if ( queryNav && this.categoriesByBreadcrumb ) {
        const queryGroup = this.categoriesByBreadcrumb.categoryGroupsByNav[queryNav];
        if ( queryGroup ) {
          categoriesByBreadcrumb = queryGroup;
          const navBreadcrumb = queryNav.split( '/' );
          let nav = '';
          for ( let idx = 0; idx < navBreadcrumb.length; idx++ ) {
            const crumb = navBreadcrumb[idx];
            nav = nav + ( nav !== '' ? '/' : '' ) + crumb;
            const group = this.categoriesByBreadcrumb.categoryGroupsByNav[nav];
            if ( group ) {
              breadcrumb.push( { path: '/', query: { nav }, name: group.name } );
            }
          }
        }
      } else if ( this.categoriesByBreadcrumb ) {
        breadcrumb.push( { path: '/', name: this.categoriesByBreadcrumb.name } );
      }
      return { breadcrumb, categoriesByBreadcrumb };
    },
  },
};
</script>

