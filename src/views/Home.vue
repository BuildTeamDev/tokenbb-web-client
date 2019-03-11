<template>
  <div class="container">
    <nav class="level is-mobile second-nav">
      <div class="level-left">
        <div class="level-item">
          <div class="dropdown-style">
          <CategoryDropdown
            :selectedId="selectedCategoryId"
            @change="onSelectCategoryId"
            :labelForAll="'All Categories'">>
          </CategoryDropdown>
        </div>
      </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <router-link
            v-if="loggedIn"
            :to="{ path: 'new', query: { category: this.$route.query.category ? this.$route.query.category : null } }"
            class="is-topic has-icon">
            New Topic
          </router-link>
        </div>
      </div>
    </nav>
    <div class="main-content">
  <b-table
      :loading="fetching"
      :data="topicList"
      :row-class="getRowClass"
      :mobile-cards="false">

      <template slot-scope="props">
        <div class="content-box box-styling">
          <div class="content-box-left">
            <div>
              <Avatar :author="props.row.author.user"
                  :owner="props.row.author.owner_id"
                  size="large"></Avatar>
              </div>
          </div>
        <div class="content-box-middle">
        <div class="break-words">
          <router-link :to="topicRoute(props.row)">
            <h2><strong>{{ props.row.title }}</strong></h2>
          </router-link>
        </div>
        <span field="icon" width="0px" >
                <span class=" has-text-center" style="width: 100%">
                <b-icon
                  v-if="props.row.pinned"
                  icon="pin"
                  size="is-small">
                </b-icon>
              </span>
              </span>
          <span class="meta-box">
            <CategoryTag :categoryId="props.row.categoryId"></CategoryTag>
          </span>
        <span id="tiptop-control">
          <span class="tip tip-left" title="" data-original-title="Views"><b-icon icon="eye" size="is-small"></b-icon> {{ props.row.numberOfViews }}</span>
          <span class="tip tip-center" title="" data-original-title="Number of Replies"><b-icon icon="reply" size="is-small"></b-icon> {{ props.row.numberOfReplies }}</span>
          <span class="tip tip-right" title="" data-original-title="Last Reply"><b-icon icon="clock" size="is-small"></b-icon> {{ props.row.lastReply.time | fromNow }}</span>
        </span>
        </div>
        <div class="content-box-right">
        <div class="upvote-button">
          <Upvote
                  :votes="[]"
                  :author="props.row.steem.author"
                  :permlink="props.row.steem.permlink">
          </Upvote>
        </div>
        </div>
        </div>
      </template>

    </b-table>
    </div>
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
  data() {
    return {
      selectedCategoryId: null,
      selected: null,
    };
  },
  watch: {
    categoryList( value ) {
      const queryCategory = this.$route.query.category;
      if ( this.$route.query.category && !this.selectedCategoryId ) {
        const selectedCategory = value.find( ( category ) => {
          return category.slug === queryCategory
            || category._id === queryCategory;
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
