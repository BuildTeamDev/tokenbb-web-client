<template>
  <div class="post columns is-mobile">
    <div class="column is-narrow">
      <Avatar :author="data.author.user" :owner="data.author.owner_id" size="large"></Avatar>
    </div>

    <div class="column is-8 post-body">
      <header class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <strong>{{ data.author.user }}</strong>
            <br>
          </div>
        </div>

        <div class="level-right">
          <p class="level-item">
            <small>
              {{ data.created | formatDate() }}
            </small>
          </p>
        </div>
      </header>

      <article
        v-if="!editing"
        class="content has-text-left"
        v-html="$sanitize(data.body)">
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

      <footer class="level is-mobile">
        <div class="level-left"></div>
        <div class="level-right">
          <div class="level-item">
            <a  v-bind:href="this.steemitLink" target="_blank">
              View on steemit.com
            </a>
          </div>
          <div class="level-item">
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
      </footer>

    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar.vue';
import Upvote from '@/components/Upvote.vue';
import ModActions from '@/components/ModActions.vue';

export default {
  components: {
    Avatar,
    Upvote,
    ModActions,
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
