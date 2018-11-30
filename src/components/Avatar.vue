<template>
  <b-tooltip
    :label="'@' + author"
    size="is-small"
    type="is-black">
    <figure class="image avatar" :class="classes">
      <img
        class="is-rounded"
        :title="author"
        :src="avatarURL(author, owner)">
    </figure>
  </b-tooltip>
</template>

<script>
const SIZES = {
  small: 'is-16x16',
  medium: 'is-32x32',
  large: 'is-48x48',
};

export default {
  props: {
    author: String,
    owner: String,
    size: String,
  },
  computed: {
    classes() {
      return SIZES[this.size];
    },
  },
  methods: {
    avatarURL( author, owner ) {
      if ( author !== 'tokentestanon' ) {
        return `https://img.busy.org/@${author}`;
      }
      return `https://robohash.org/${owner}.png?set=set4`;
    },
  },
};
</script>
