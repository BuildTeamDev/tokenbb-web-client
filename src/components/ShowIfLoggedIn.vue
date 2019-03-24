<template>
  <div>
    <div v-if="!loggedIn && !hidden">
      <button
        class="button is-small"
        @click="login"
      >
        {{ text || 'Login to reply' }}
      </button>
    </div>
    <slot v-if="loggedIn" />
  </div>
</template>

<script>

export default {
  props: {
    text: String,
    hidden: Boolean,
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.username;
    },
  },
  methods: {
    login() {
      this.$store.commit( 'auth/toggleAccountModal' );
    },
  },
};
</script>
