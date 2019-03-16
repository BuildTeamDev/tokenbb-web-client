<template>
  <div class="container home">
    <div class="level is-mobile">
      <div class="level-left">
        <CategoryDropdown :selected-id="selectedCategoryId" :label-for-all="'All Categories'" @change="onSelectCategoryId" />
      </div>
      <div class="level-right">
        <router-link
          v-if="loggedIn"
          :to="{
            path: 'new',
            query: {
              category: this.$route.query.category ? this.$route.query.category : null,
            },
          }"
        >
          <button class="button is-small is-topic">New Topic</button> </router-link
        >>
      </div>
    </div>
    <b-table :loading="fetching" :data="currentPage" :row-class="getRowClass" :mobile-cards="false">
      <template slot-scope="props">
        <div class="box is-mobile">
          <article class="media is-mobile">
            <figure class="media-left">
              <p class="image is-64x64">
                <Avatar :author="props.row.author.user" :owner="props.row.author.owner_id" size="large" />
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <router-link :to="topicRoute(props.row)">
                  <h2 class="title is-6">
                    <span v-if="props.row.pinned" type="is-secondary">
                      <b-icon icon="pin" size="is-small" />
                    </span>
                    {{ props.row.title }}
                  </h2>
                </router-link>
              </div>
              <nav class="level is-tablet">
                <div class="level-left post-stats">
                  <span class="level-item">
                    <span class="tag is-small">
                      <CategoryTag :category-id="props.row.categoryId" />
                    </span>
                  </span>
                  <span class="level-item">
                    <Upvote :votes="[]" :author="props.row.steem.author" :permlink="props.row.steem.permlink" />
                  </span>
                  <span class="level-item">
                    <span class title="View Count" data-original-title="Number of Views">
                      <b-icon icon="eye" size="is-small" />
                      {{ props.row.numberOfViews }}
                    </span>
                    <span class title="Reply Count" data-original-title="Number of Replies">
                      <b-icon icon="reply" size="is-small" />
                      {{ props.row.numberOfReplies }}
                    </span>
                  </span>
                  <span class="level-item">
                    <DateTimeTag :last-reply="props.row.lastReply" :number-of-replies="props.row.numberOfReplies" />
                  </span>
                </div>
              </nav>
            </div>
          </article>
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

import CategoryTag from '../components/CategoryTag.vue';
import CategoryDropdown from '../components/CategoryDropdown.vue';
import Upvote from '../components/Upvote.vue';
import Avatar from '../components/Avatar.vue';
import DateTimeTag from '../components/DateTimeTag';

export default {
  name: 'Home',
  components: {
    DateTimeTag,
    BIcon: Icon,
    BTable: Table,
    BPagination: Pagination,
    CategoryDropdown,
    Upvote,
    Avatar,
    CategoryTag,
  },
  computed: {
    ...mapState( 'topics', [ 'fetching', 'list' ] ),
    ...mapState( 'categories', [ 'categoriesById', 'categoryList' ] ),
    loggedIn() {
      return this.$store.state.auth.username;
    },
    currentPage() {
      const topics = this.topicList || [];
      const start = ( this.current - 1 ) * this.perPage;
      const end = this.current * this.perPage;
      return topics.slice( start, end );
    },
    topicList() {
      if ( !this.selectedCategoryId ) {
        return this.$store.state.topics.topicList;
      }

      return this.$store.state.topics.topicList.filter( ( topic ) => {
        return topic.categoryId === this.selectedCategoryId;
      } );
    },
  },
  data() {
    return {
      selectedCategoryId: null,
      selected: null,
      total: 0,
      current: 1,
      perPage: 10,
    };
  },
  watch: {
    categoryList( value ) {
      const queryCategory = this.$route.query.category;
      if ( this.$route.query.category && !this.selectedCategoryId ) {
        const selectedCategory =
          value.find( ( category ) => {
            return category.slug === queryCategory || category._id === queryCategory;
          } ) || {};
        this.selectedCategoryId = selectedCategory._id;
      }
    },
  },
  methods: {
    getRowClass( row ) {
      return row.pinned ? 'pinned' : '';
    },
    onSelectCategoryId( selectedCategory ) {
      this.selectedCategoryId = selectedCategory._id;
      this.$router.push( {
        path: '/',
        query: selectedCategory ? { category: selectedCategory.slug } : {},
      } );
    },
    topicRoute( topic ) {
      return `/topics/${topic.author.user}/${topic.permlink}`;
    },
  },
};
</script>
