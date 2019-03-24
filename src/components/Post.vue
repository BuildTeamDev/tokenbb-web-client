<template>
  <div class="container post">
    <div class="box is-mobile">
      <div class="level is-tablet">
        <div class="level-left">
          <div class="level-item">
            <Avatar
              :author="data.author.user"
              :owner="data.author.owner_id"
              size="large"
            />
          </div>
          <div class="level-item">
            <p class="username">
              {{ data.author.user | usernameDisplay(data.author.owner_id) }}
            </p>
          </div>
          <div class="level-item is-tablet">
            <ModActions
              :post="data"
              :is-reply="isReply"
            />
          </div>
        </div>
        <div class="level-right">
          <p class="level-item">
            <small>
              <DateTimeTag :time="data.createdAt" />
            </small>
          </p>
        </div>
      </div>
      <div class="media-content">
        <article
          v-if="!editing"
          class="content"
          v-html="$renderMD(data.body)"
        />
      </div>
      <form v-if="editing">
        <b-field>
          <b-input
            v-model="text"
            autofocus
            type="textarea"
            :loading="fetching"
            :disabled="fetching"
            placeholder="Type here."
          />
        </b-field>

        <b-field>
          <a
            class="button is-small is-topic save"
            :class="{ 'is-loading': this.fetching }"
            @click="onSave"
          >
            Save
          </a>
          <span />
          <p>
            <a
              class="button is-small"
              :disabled="this.fetching"
              @click="onCancel"
            >
              Cancel
            </a>
          </p>
        </b-field>
      </form>
      <ShowIfLoggedIn
        :hidden="true"
      >
        <div class="level is-tablet">
          <div class="level-left" />
          <div class="level-right">
            <div class="level-item edit-this">
              <a
                v-if="editable && !editing"
                class="has-icon"
                @click="onStartEditing"
              >
                <b-icon
                  icon="square-edit-outline"
                  size="is-small"
                />
                <span>Edit</span>
              </a>
            </div>
            <div class="level-item quote-this">
              <a @click="handleQuoteClick">
                <b-icon
                  icon="comment"
                  size="is-small"
                />Quote this</a>
            </div>
          </div>
        </div>
      </ShowIfLoggedIn>
      <div class="level">
        <div class="level-left" />
        <div class="level-right">
          <div class="level-item">
            <Upvote
              :votes="[]"
              :author="data.steem.author"
              :permlink="data.steem.permlink"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import Field from 'buefy/src/components/field/Field';
import Input from 'buefy/src/components/input/Input';
import Icon from 'buefy/src/components/icon/Icon';

import Avatar from '../components/Avatar.vue';
import Upvote from '../components/Upvote.vue';
import ModActions from '../components/ModActions.vue';
import { publishEdit } from '../services/api.service.js';
import { errorAlertOptions } from '../utils/notifications.js';
import ShowIfLoggedIn from '../components/ShowIfLoggedIn.vue';
import DateTimeTag from '../components/DateTimeTag';

import { Toast } from 'buefy/dist/components/toast';

export default {
  components: {
    BField: Field,
    BInput: Input,
    BIcon: Icon,
    Avatar,
    Upvote,
    ModActions,
    ShowIfLoggedIn,
    DateTimeTag,
  },
  props: {
    data: Object,
    isReply: Boolean,
  },
  data() {
    return {
      fetching: false,
      editing: false,
      text: '',
    };
  },
  computed: {
    editable() {
      return this.$store.state.auth.accounts.find( ( account ) => account.user_id === this.data.author.owner_id );
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

      publishEdit( this.data, { content: this.text } )
        .then( ( post ) => {
          console.log( post );
          this.data.body = post.data.body;
          this.editing = false;
          this.fetching = false;
        } )
        .catch( ( err ) => {
          console.error( err );
          Toast.open( errorAlertOptions( 'Oops! Could not edit your post at this moment' ) );
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
      this.scrollTo( 'endOfTopic' );
    },
    scrollTo( id ) {
      window.scrollTo( 0, document.getElementById( id ).offsetTop );
    },
  },
};
</script>
