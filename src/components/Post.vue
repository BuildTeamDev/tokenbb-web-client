<template>
  <div class="post columns is-mobile box-styling">
    <div class="column is-12 post-body">
      <header class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <Avatar :author="data.author.user" :owner="data.author.owner_id" size="large"></Avatar>
            <p class="username">{{ data.author.user | usernameDisplay(data.author.owner_id) }}</p>
          </div>
        </div>

        <div class="level-right">
          <p class="level-item">
            <small>
              <b-icon icon="clock" size="is-small"></b-icon>{{ data.createdAt | fromNow }}
            </small>
          </p>
        </div>
      </header>

      <article
        v-if="!editing"
        class="content has-text-left"
        v-html="$renderMD(data.body)">
      </article>

      <form v-if="editing">
        <b-field>
          <b-input type="textarea"
            :loading="fetching"
            :disabled="fetching"
            v-model="text"
            placeholder="Type here.">
          </b-input>
        </b-field>

        <b-field>
          <p class="control">
            <a class="button is-primary"
              :class="{ 'is-loading': this.fetching }"
              @click="onSave">
              Save
            </a>
          </p>

          <p class="control">
            <a class="button"
              :disabled="this.fetching"
              @click="onCancel">
              Cancel
            </a>
          </p>
        </b-field>
      </form>
      <div class="level is-mobile">
        <div class="level-left"></div>
        <div class="level-right">
          <div class="level-item">
            <ShowIfLoggedIn :hidden="true" class="quote-this">
            <a @click="handleQuoteClick">Quote this</a>
            </ShowIfLoggedIn>
          </div>
          <div class="mod-display">
            <ModActions :post="data" :isReply="isReply">
            </ModActions>
          </div>
          <div class="level-item">
            <p class="buttons">
              <!--
              <a v-if="editable && !editing"
                @click="onStartEditing"
                class="button is-small has-icon">
                <b-icon
                  icon="square-edit-outline"
                  size="is-small">
                </b-icon>
                <span>Edit</span>
              </a>
              -->
              <Upvote
                :votes="[]"
                :author="data.steem.author"
                :permlink="data.steem.permlink">
              </Upvote>
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar.vue';
import Upvote from '@/components/Upvote.vue';
import ModActions from '@/components/ModActions.vue';
import { errorAlertOptions } from '../utils/notifications.js';
import ShowIfLoggedIn from '@/components/ShowIfLoggedIn.vue';

export default {
  components: {
    Avatar,
    Upvote,
    ModActions,
    ShowIfLoggedIn,
  },
  props: {
    data: Object,
    isReply: Boolean,
  },
  computed: {
    editable() {
      return this.$store.state.auth.accounts.includes( this.data.author );
    },
    steemitLink() {
      return `https://steemit.com/@${this.data.steem.author}/${this.data.steem.permlink}`;
    },
  },
  mounted() {
  },
  methods: {
    avatarURL( author ) {
      return 'https://img.busy.org/@' + author;
    },
    onStartEditing() {
      this.text = this.data.body;
      this.editing = true;
    },
    onSave() {
      this.fetching = true;

      const payload = {
        post: this.data,
        content: this.text,
      };

      this.$store.dispatch( 'posts/editPost', payload )
        .then( ( post ) => {
          this.data.body = post.body;
          this.editing = false;
          this.fetching = false;
        } )
        .catch( ( err ) => {
          console.error( err );
          this.$toast.open( errorAlertOptions( 'Oops! Could not edit your post at this moment' ) );
          this.fetching = false;
        } );
    },
    onCancel() {
      if ( this.fetching ) {
        return;
      }

      this.text = '';
      this.editing = false;
    },
    handleQuoteClick() {
      this.$root.$emit( 'quote-click', this.data );
    },
  },
  data() {
    return {
      fetching: false,
      editing: false,
      text: '',
    };
  },
};
</script>
