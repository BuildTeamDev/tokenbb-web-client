<template>
  <div class="container topic-view">
    <div
      v-if="fetching"
      class="spacer"
    >
      <b-loading
        :is-full-page="false"
        :active="fetching"
      />
    </div>

    <div v-if="!fetching">
      <div class="post-page">
        <header class="has-text-left">
          <h1 class="title is-3">
            {{ topic.title }}
          </h1>
          <div class="level-left">
            <Breadcrumb :crumbs="breadcrumb" />
          </div>
          <div class="nav-control">
            <a
              class="topic-nav topic-nav-to-end"
              @click="scrollTo('endOfTopic')"
            >Jump to end
            </a>
          </div>
        </header>

        <br>

        <main ref="posts">
          <Post :data="topic" />
          <b-pagination
            v-if="topic.replies.length > perPage"
            :total="topic.replies.length"
            :current.sync="current"
            order="is-centered"
            size="is-normal"
            :simple="false"
            :rounded="false"
            :per-page="perPage"
          />
          <Post
            v-for="(reply, index) in currentPage"
            :key="index"
            :data="reply"
            :is-reply="true"
          />
          <a
            class="topic-nav topic-nav-to-top"
            @click="scrollTo('topOfPage')"
          >
            Back to Top
          </a>
          <b-pagination
            v-if="topic.replies.length > perPage"
            :total="topic.replies.length"
            :current.sync="current"
            order="is-centered"
            size="is-normal"
            :simple="false"
            :rounded="false"
            :per-page="perPage"
          />
        </main>

        <br>
        <a id="endOfTopic" />
        <ShowIfLoggedIn>
          <ReplyForm
            :fetching="$store.state.replies.fetching"
            :text="replyText"
            :quote="quote"
            :quote-author="quoteAuthor"
            @input="onReplyInput"
            @submit="onReplySubmit"
          />
        </ShowIfLoggedIn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Loading from 'buefy/src/components/loading/Loading';
import Pagination from 'buefy/src/components/pagination/Pagination';

import Breadcrumb from '../components/Breadcrumb.vue';
import Post from '../components/Post.vue';
import ReplyForm from '../components/ReplyForm.vue';
import ShowIfLoggedIn from '../components/ShowIfLoggedIn.vue';
import { getTopic } from '../services/post.service.js';
import { errorAlertOptions } from '../utils/notifications.js';

import { Toast } from 'buefy/dist/components/toast';

export default {
  name: 'Topic',
  components: {
    BLoading: Loading,
    BPagination: Pagination,
    Breadcrumb,
    Post,
    ReplyForm,
    ShowIfLoggedIn,
  },
  data() {
    return {
      fetching: true,
      topic: {},
      replyText: '',
      total: 0,
      current: 1,
      perPage: 10,
    };
  },
  created() {
    this.fetchTopic();
    this.$root.$on( 'topicRefresh', this.fetchTopic );
  },
  computed: {
    ...mapState( 'categories', [
      'categoriesById',
      'categoriesByBreadcrumb',
    ] ),
    currentPage() {
      const replies = this.topic.replies || [];
      const start = ( this.current - 1 ) * this.perPage;
      const end = this.current * this.perPage;
      return replies.slice( start, end );
    },
    quote() {
      const arr = this.currentPage;
      if ( arr && arr.length > 0 ) {
        return arr[arr.length - 1].body.trim();
      } else if ( this.topic.body ) {
        return this.topic.body.trim();
      }
      return '';
    },
    quoteAuthor() {
      const topic = this.topic;
      return topic.lastReply.author === '' ? topic.author.user : topic.lastReply.author;
    },
    breadcrumb() {
      const breadcrumb = [];
      const category = this.categoriesById[this.topic.categoryId];
      if ( category ) {
        let nav = '';
        if ( category.nav ) {
          category.nav.split( '/' ).forEach( ( crumb ) => {
            nav = nav + ( nav !== '' ? '/' : '' ) + crumb;
            const group = this.categoriesByBreadcrumb.categoryGroupsByNav[nav];
            if ( group ) {
              breadcrumb.push( { path: '/', query: { nav }, name: group.name } );
            }
          } );
        }
        breadcrumb.push( { path: '/topic-list', query: { category: category.slug }, name: category.title } );
        breadcrumb.push( { path: this.$route.path, query: this.$route.query, name: this.topic.title } );
      }
      return breadcrumb;
    },
  },
  methods: {
    onReplyInput( text ) {
      this.replyText = text;
    },
    onReplySubmit() {
      const payload = {
        parentComment: this.topic,
        content: this.replyText,
      };

      this.$store.dispatch( 'replies/submitReply', payload )
        .then( ( reply ) => {
          if ( reply ) {
            this.fetchTopic( true );
            this.replyText = '';
          }
        } )
        .catch( ( err ) => {
          console.log( err );
          Toast.open( errorAlertOptions( 'Oops! Could not submit reply at this moment', err ) );
          this.$ga.exception( err );
        } );
    },
    fetchTopic( scrollDown ) {
      const { author, permlink } = this.$route.params;

      this.fetching = true;

      return getTopic( author, permlink ).then( ( topic ) => {
        if ( !topic ) {
          return this.$router.push( '/' );
        }

        this.topic = topic;
        this.fetching = false;

        // Hack to prevent scrolling down on load
        this.$nextTick( function () {
          if ( scrollDown ) {
            this.scrollTo( 'endOfTopic' );
          } else {
            this.scrollTo( 'topOfPage' );
          }
        } );
      } );
    },
    scrollTo( id ) {
      window.scrollTo( 0, document.getElementById( id ).offsetTop );
    },
  },
};
</script>
