<template>
  <div>
    <b-icon
      icon="clock"
      size="is-small"
    />
    {{ this.timeFromNow }}
    <template v-if="!this.time && this.numberOfReplies > 0">
      <span>by</span>
      <Avatar
        :author="this.lastReply.author"
        :owner="this.lastReply.owner"
        size="small"
      />
    </template>
  </div>
</template>

<script>

import Icon from 'buefy/src/components/icon/Icon';
import Avatar from '../components/Avatar.vue';

import { DateTime } from 'luxon';

import { formatDateTimeFromNow } from '../utils/content';

export default {
  components: {
    BIcon: Icon,
    Avatar,
  },
  props: {
    time: String,
    lastReply: {
      time: String,
      author: String,
      owner: String,
    },
    numberOfReplies: Number,
  },
  data() {
    return {
      ticker: 0,
      timeout: 1000,
      timeoutHandle: 0,
    };
  },
  computed: {
    timeFromNow() {
      const dummyTicker = this.$data.ticker;
      return formatDateTimeFromNow( this.time || this.lastReply.time );
    },
  },
  mounted() {
    const self = this;
    clearTimeout( self.$data.timeoutHandle );
    self.$data.timeoutHandle = setTimeout( updateTime, self.$data.timeout );
    function updateTime() {
      const timeString = self.$props.time || self.$props.lastReply.time;
      const time = DateTime.fromISO( timeString );
      const minutesDiff = DateTime.local().diff( time, 'minutes' ).as( 'minutes' );
      if ( minutesDiff < 1 ) {
        self.$data.timeout = 1000;
      } else if ( minutesDiff < 10 ) {
        self.$data.timeout = 10 * 1000;
      } else if ( minutesDiff < 60 ) {
        self.$data.timeout = 60 * 1000;
      } else if ( minutesDiff < 24 * 60 ) {
        self.$data.timeout = 10 * 60 * 1000;
      } else {
        self.$data.timeout = 60 * 60 * 1000;
      }
      if ( self.$data.timeout > 1000 ) {
        self.$data.timeout -= parseInt( Math.random() * 0.1 * self.$data.timeout );
      }
      console.log( `Updating time ${minutesDiff}, ${self.$data.timeout}}` );
      self.$data.ticker += 1;
      clearTimeout( self.$data.timeoutHandle );
      self.$data.timeoutHandle = setTimeout( updateTime, self.$data.timeout );
    }
  },
  beforeDestroy() {
    clearTimeout( this.$data.timeoutHandle );
  },
};
</script>
