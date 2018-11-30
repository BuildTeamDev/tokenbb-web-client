<template>
  <div class="container">
    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <CategoryDropdown
            :selectedId="selectedCategoryId"
            @change="onSelectCategoryId">
          </CategoryDropdown>
        </div>
      </div>

      <div class="level-right">
        <div class="level-item">
          <router-link
            v-if="loggedIn"
            to="/new"
            class="button is-primary has-icon">
            New Topic
          </router-link>
        </div>
      </div>
    </nav>

    <b-table
      :loading="fetching"
      :data="topicList"
      :row-class="getRowClass"
      :mobile-cards="false"
      striped>

      <template slot-scope="props">
        <b-table-column field="icon" width="0px" >
          <div class=" has-text-center" style="width: 100%">
          <b-icon
            v-if="props.row.pinned"
            icon="pin"
            size="is-small">
          </b-icon>
          </div>
        </b-table-column>
        <b-table-column field="title" label="Topic">
          <router-link :to="topicRoute(props.row)">
            {{ props.row.title }}
          </router-link>
        </b-table-column>
        <b-table-column field="author" label="Author">
          <Avatar :author="props.row.author.user"
                  :owner="props.row.author.owner_id"
                  size="medium"></Avatar>
        </b-table-column>
        <b-table-column field="categoryId" label="Category">
          <CategoryTag :categoryId="props.row.categoryId">
          </CategoryTag>
        </b-table-column>
        <b-table-column field="numberOfReplies" label="Replies">
          {{ props.row.numberOfReplies }}
        </b-table-column>
        <b-table-column field="numberOfViews" label="Views">
          {{ props.row.numberOfViews }}
        </b-table-column>
        <b-table-column field="numberOfReplies" label="Last Reply">
          <template v-if="props.row.numberOfReplies > 0">
            {{ props.row.lastReply.time | fromNow }}
          </template>
        </b-table-column>
        <b-table-column field="numberOfReplies" label="User">
          <template v-if="props.row.numberOfReplies > 0">
            <Avatar :author="props.row.lastReply.author"
                    :owner="props.row.lastReply.owner"
                    size="medium"></Avatar>
          </template>
        </b-table-column>
        <b-table-column field="numberOfVotes" label="Votes">
          <Upvote
                  :votes="[]"
                  :author="props.row.steem.author"
                  :permlink="props.row.steem.permlink">
          </Upvote>
        </b-table-column>
      </template>

    </b-table>
  </div>
</template>

<script>
import CategoryTag from '@/components/CategoryTag.vue';
import { mapState } from 'vuex';

import CategoryDropdown from '@/components/CategoryDropdown.vue';
import Upvote from '@/components/Upvote.vue';
import Avatar from '@/components/Avatar.vue';

export default {
  name: 'home',
  components: {
    CategoryDropdown,
    Upvote,
    Avatar,
    CategoryTag,
  },
  computed: {
    ...mapState( 'topics', [
      'fetching',
      'list',
    ] ),
    ...mapState( 'categories', [
      'categoriesById',
      'categoryList',
    ] ),
    loggedIn() {
      return this.$store.state.auth.username;
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
  beforeRouteUpdate( to, from, next ) {
    this.fetchCategory( to.query.category );

    next();
  },
  mounted() {
    this.$store.dispatch( 'categories/fetchAll' )
      .then( () => this.$store.dispatch( 'topics/fetchAll' ) )
      .then( () => {
        this.$nextTick( () => {
          const categoryParam = this.$router.currentRoute.query.category;
          const counter = parseInt( this.$router.currentRoute.query.i ) || 0;
          if ( categoryParam ) {
            this.$router.push( {
              path: '/',
              query: { category: categoryParam, i: counter + 1 },
            } );
            this.$nextTick( () => {
              this.$router.push( {
                path: '/',
                query: { category: categoryParam },
              } );
            } );
          }
        } );
      } );
  },
  data() {
    return {
      selectedCategoryId: null,
      selected: null,
    };
  },
  methods: {
    fetchCategory( categoryQuery ) {
      this.selectedCategoryId = categoryQuery || null;
      const selectedCategory = this.$store.state.categories.categoryList.find( ( category ) => {
        return category.slug === this.selectedCategoryId
               || category._id === this.selectedCategoryId;
      } ) || {};
      this.selectedCategoryId = selectedCategory._id;
    },
    getRowClass( row ) {
      return row.pinned ? 'pinned' : '';
    },
    onSelectCategoryId( selectedCategory ) {
      this.$router.push( {
        path: '/',
        query: selectedCategory
          ? { category: selectedCategory.slug }
          : {},
      } );
    },
    topicRoute( topic ) {
      return `/topics/${topic.author.user}/${topic.permlink}`;
    },
  },
};
</script>
