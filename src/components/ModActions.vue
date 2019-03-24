<template>
  <div v-if="isAdmin()">
    <b-select
      v-model="selected"
      placeholder="Moderator actions"
      size="is-small"
      :loading="loading"
      @input="onSelect"
    >
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option"
      >
        {{ option.name }}
      </option>
    </b-select>
  </div>
</template>

<script>

import Select from 'buefy/src/components/select/Select';

import { hide, pin, unpin } from '../services/api.service.js';

import { Toast } from 'buefy/dist/components/toast';
import { Dialog } from 'buefy/dist/components/dialog';

function noop() {}

export default {
  components: {
    BSelect: Select,
  },
  props: {
    post: Object,
    isReply: Boolean,
  },
  data() {
    return {
      loading: false,
      options: [
        {
          name: '-- Moderator actions --',
          callback: noop,
        },
        {
          name: 'Hide this post',
          callback: this.hideTopic,
        },
      ],
      selected: null,
      isComponentModalActive: false,
      actions: {
        'pin': {
          name: 'Pin this topic',
          callback: this.pinTopic,
        },
        'unpin': {
          name: 'Unpin this topic',
          callback: this.unpinTopic,
        },
      },
    };
  },
  mounted() {
    this.selected = this.options[0];

    if ( !this.isReply ) {
      const action = this.post.pinned
        ? this.actions.unpin
        : this.actions.pin;

      this.options.push( action );
    }
  },
  methods: {
    isAdmin() {
      return this.$store.state.auth.roles.admin;
    },
    onSelect( item ) {
      item.callback();
      this.$nextTick( () => {
        this.selected = this.options[0];
        this.isComponentModalActive = true;
      } );
    },
    pinTopic() {
      Dialog.confirm( {
        message: 'This will pin the topic to the top of the category. '
          + 'Are you sure you want to do this?',
        onConfirm: async () => {
          this.loading = true;

          try {
            await pin( this.post );

            this.$store.commit( 'topics/pin', this.post );

            Toast.open( {
              message: 'The topic has been pinned.',
              type: 'is-primary',
            } );
            this.$router.push( { name: 'home' } );
          } catch ( err ) {
            const result = err.error.message;
            Toast.open( {
              message: `Failed to pin the topic: ${result}`,
              type: 'is-danger',
            } );
          }

          this.loading = false;
        },
      } );
    },
    unpinTopic() {
      Dialog.confirm( {
        message: 'This will unpin the topic. '
          + 'Are you sure you want to do this?',
        onConfirm: async () => {
          this.loading = true;

          try {
            await unpin( this.post );

            this.$store.commit( 'topics/unpin', this.post );

            Toast.open( {
              message: 'The topic has been unpinned.',
              type: 'is-primary',
            } );
            this.$router.push( { name: 'home' } );
          } catch ( err ) {
            const result = err.error.message;
            Toast.open( {
              message: `Failed to unpin the topic: ${result}`,
              type: 'is-danger',
            } );
          }

          this.loading = false;
        },
      } );
    },
    hideTopic() {
      Dialog.confirm( {
        message: 'This will hide the post from users. '
                + 'Are you sure you want to do this?',
        onConfirm: async () => {
          this.loading = true;

          try {
            await hide( this.post );

            Toast.open( {
              message: 'The post has been hidden.',
              type: 'is-primary',
            } );
            if ( this.post.replies ) {
              this.$router.push( { name: 'home' } );
            } else {
              this.$emit( 'topicRefresh' );
            }
          } catch ( err ) {
            const result = err.error.message;
            Toast.open( {
              message: `Failed to hide the post: ${result}`,
              type: 'is-danger',
            } );
          }

          this.loading = false;
        },
      } );
    },
  },
};
</script>
