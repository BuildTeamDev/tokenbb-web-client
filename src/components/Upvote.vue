<template>
  <ShowIfLoggedIn :hidden="true" class="upvote">
    <div class="field has-addons">
      <p class="control">
        <a class="button is-small is-static has-text-black">{{ value }}</a>
      </p>
      <p class="control">
        <a class="button is-small is-static has-text-black">{{ votes.length }}</a>
      </p>
      <b-dropdown position="is-top-left" hoverable :disabled="this.voted">
        <p class="control" slot="trigger">
          <a class="button is-primary is-small"
            :class="{ 'is-loading': this.fetching }"
            :disabled="this.voted"
            @click="handleClick">
            <!--<span>Upvote</span>-->
            <b-icon icon="arrow-up-drop-circle-outline" size="is-small">
            </b-icon>
          </a>
        </p>

        <b-dropdown-item custom>
          <div class="container popover">
            <div class="columns">
              <div class="column is-3 vertical">
                <span class="percent-label">{{ percent }}%</span>
              </div>
              <div class="column is-6">
                <input class="slider is-primary is-circle"
                  ref="slider"
                  @input="handleChange"
                  step="1"
                  min="0"
                  max="100"
                  :value="percent"
                  type="range">
              </div>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown>
    </div>
  </ShowIfLoggedIn>
</template>

<script>
import { vote } from '../services/api.service.js';
import steem from '../services/steem.service.js';

import ShowIfLoggedIn from '@/components/ShowIfLoggedIn.vue';

import Timeout from 'await-timeout';

export default {
  components: {
    ShowIfLoggedIn,
  },
  props: {
    author: String,
    permlink: String,
  },
  data() {
    return {
      percent: 10,
      fetching: false,
      value: '0.000',
      votes: [],
      voted: false,
    };
  },
  mounted() {
    this.updateValue();
  },
  methods: {
    handleChange() {
      this.percent = this.$refs.slider.value;
    },
    async updateValue() {
      const data = await steem.getContent( this.author, this.permlink );
      const pending = parseFloat( data.pending_payout_value.split( ' ' )[0] );
      const paid = parseFloat( data.total_payout_value.split( ' ' )[0] );
      this.value = ( paid + pending ).toFixed( 3 );
      this.votes = data.active_votes;
      this.voted = paid > 0
        || this.$store.state.auth.current === 'anon'
        || this.votes.filter( ( _vote ) => _vote.voter === this.$store.state.auth.current ).length > 0;
    },
    async handleClick() {
      if ( this.voted ) {
        return this.$toast.open( {
          message: 'Oops! Already voted!.',
          type: 'is-danger',
        } );
      }
      this.fetching = true;

      try {
        await vote( this.author, this.permlink, this.$store.state.auth.current, this.percent );
        this.$toast.open( {
          message: 'Upvoted!',
          type: 'is-primary',
        } );
        await Timeout.set( 3000 );
        await this.updateValue();
      } catch ( err ) {
        console.error( 'oops!', err );
        this.$toast.open( {
          message: 'Oops! Could not upvote at this time. ' + err,
          type: 'is-danger',
        } );
      }
      this.fetching = false;
    },
  },
};
</script>
