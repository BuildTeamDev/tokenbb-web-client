<template>
  <div class="container topic-list">
    <div class="level is-tablet">
      <div class="level-left">
        <div class="level-item breadcrumb">
          <Breadcrumb :crumbs="breadcrumb" />
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <router-link
            v-if="loggedIn"
            :to="{ path: 'new', query: { category: this.$route.query.category ? this.$route.query.category : null } }"
          >
            <button class="button is-small">
              New Topic
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <div
      v-if="selectedCategory"
      class="level-left"
    >
      <router-link :to="{ path: '/topic-list' }">
        <small>Show All Topics</small>
      </router-link>
    </div>
    <b-table
      :loading="fetching"
      :data="currentPage"
      :row-class="getRowClass"
      :mobile-cards="false"
    >
      <template slot-scope="props">
        <div class="box is-mobile">
          <router-link :to="topicRoute(props.row)">
            <article class="media is-mobile">
              <figure class="media-left">
                <p class="image is-64x64">
                  <Avatar
                    :author="props.row.author.user"
                    :owner="props.row.author.owner_id"
                    size="large"
                  />
                </p>
              </figure>
              <div class="media-content">
                <div class="content topic-title">
                  <h2 class="title is-6">
                    <span
                      v-if="props.row.pinned"
                      type="is-secondary"
                    >
                      <b-icon
                        icon="pin"
                        size="is-small"
                      /></span>
                    {{ props.row.title }}
                  </h2>
                </div>
                <nav class="level is-tablet">
                  <div class="level-left post-stats">
                    <span class="level-item">
                      <span class="tag is-small">
                        <CategoryTag :category-id="props.row.categoryId" />
                      </span>
                    </span>
                    <span class="level-item">
                      <Upvote
                        :votes="[]"
                        :author="props.row.steem.author"
                        :permlink="props.row.steem.permlink"
                      />
                    </span>
                    <span class="level-item">
                      <span
                        class=""
                        title="View Count"
                        data-original-title="Number of Views"
                      >
                        <b-icon
                          icon="eye"
                          size="is-small"
                        /> {{ props.row.numberOfViews }}
                      </span>
                      <span
                        class=""
                        title="Reply Count"
                        data-original-title="Number of Replies"
                      >
                        <b-icon
                          icon="reply"
                          size="is-small"
                        /> {{ props.row.numberOfReplies }}
                      </span>
                    </span>
                    <span class="level-item">
                      <DateTimeTag
                        :last-reply="props.row.lastReply"
                        :number-of-replies="props.row.numberOfReplies"
                      />
                    </span>
                  </div>
                </nav>
              </div>
            </article>
          </router-link>
        </div>
      </template>
    </b-table>
    <b-pagination
      v-if="topicList.length > perPage"
      :total="topicList.length"
      :current.sync="current"
      order="is-centered"
      size="is-small"
      :simple="false"
      :rounded="false"
      :per-page="perPage"
    />
  </div>
</template>

<script>

import { mapState } from 'vuex';

import Icon from 'buefy/src/components/icon/Icon';
import Table from 'buefy/src/components/table/Table';
import Pagination from 'buefy/src/components/pagination/Pagination';

import Breadcrumb from '../components/Breadcrumb.vue';
import CategoryTag from '../components/CategoryTag.vue';
import Upvote from '@/components/Upvote.vue';
import Avatar from '@/components/Avatar.vue';
import DateTimeTag from '../components/DateTimeTag';

export default {
  name: 'Home',
  components: {
    DateTimeTag,
    BIcon: Icon,
    BTable: Table,
    BPagination: Pagination,
    Breadcrumb,
    Upvote,
    Avatar,
    CategoryTag,
  },
  data() {
    return {
      selectedCategory: null,
      total: 0,
      current: 1,
      perPage: 10,
    };
  },
  computed: {
    ...mapState( 'topics', [
      'topicList',
    ] ),
    ...mapState( 'categories', [
      'categoryList',
      'categoriesByBreadcrumb',
    ] ),
    loggedIn() {
      return this.$store.state.auth.username;
    },
    fetching() {
      return this.$store.state.topics.fetching || this.$store.state.categories.fetching;
    },
    breadcrumb() {
      const breadcrumb = [];
      if ( this.selectedCategory ) {
        if ( this.selectedCategory.nav ) {
          let nav = '';
          this.selectedCategory.nav.split( '/' ).forEach( ( crumb ) => {
            nav = nav + ( nav !== '' ? '/' : '' ) + crumb;
            const group = this.categoriesByBreadcrumb.categoryGroupsByNav[nav];
            if ( group ) {
              breadcrumb.push( { path: '/', query: { nav }, name: group.name } );
            }
          } );
        }
        breadcrumb.push( {
          path: 'topic-list',
          query: { category: this.selectedCategory.slug },
          name: this.selectedCategory.title,
        } );
      } else if ( this.categoriesByBreadcrumb ) {
        breadcrumb.push( {
          path: '/',
          query: {},
          name: this.categoriesByBreadcrumb.name,
        } );
        breadcrumb.push( {
          path: 'topic-list',
          query: {},
          name: 'All Categories',
        } );
      }
      return breadcrumb;
    },
    currentPage() {
      const topics = this.topicList || [];
      const start = ( this.current - 1 ) * this.perPage;
      const end = this.current * this.perPage;
      return topics.slice( start, end );
    },
    topicList() {
      if ( !this.selectedCategory ) {
        return this.$store.state.topics.topicList;
      }

      return this.$store.state.topics.topicList.filter( ( topic ) => {
        return topic.categoryId === this.selectedCategory._id;
      } );
    },
  },
  beforeRouteUpdate( to, from, next ) {
    if ( to.query.category ) {
      this.$store.dispatch( 'topics/fetchAll', { category: to.query.category } );
    } else {
      this.$store.dispatch( 'topics/fetchAll' );
      this.selectedCategory = null;
    }
    next();
  },
  watch: {
    categoryList( value ) {
      this.setSelectedCategory( value );
    },
  },
  created() {
    this.$store.dispatch( 'categories/fetchAll' );
  },
  mounted() {
    this.setSelectedCategory( this.categoryList );
  },
  methods: {
    setSelectedCategory( categoryList ) {
      if ( !categoryList || categoryList.length === 0 ) {
        return;
      }
      const queryCategory = this.$route.query.category;
      if ( this.$route.query.category && !this.selectedCategory ) {
        this.selectedCategory = categoryList.find( ( category ) => {
          return category.slug === queryCategory
            || category._id === queryCategory;
        } ) || {};
      }
    },
    getRowClass( row ) {
      return row.pinned ? 'pinned' : '';
    },
    onSelectCategory( selected ) {
      this.selectedCategory = selected;
      this.$router.push( {
        path: '/topic-list',
        query: selected
          ? { category: selected.slug }
          : {},
      } );
    },
    topicRoute( topic ) {
      return `/topics/${topic.author.user}/${topic.permlink}`;
    },
  },
};
</script>

