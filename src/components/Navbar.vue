<template>
  <nav  id="nav" class="navbar" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <div class="navbar-item">
          <router-link
            :to="{ path: '/' }"
            exact-active-class="noop"
            class="navbar-item">
            <h1 class="is-primary">
              <img class="logo"/>
            </h1>
          </router-link>
        </div>

        <a role="button" class="navbar-burger" :class="{ 'is-active': menuActive }" aria-label="menu" aria-expanded="false" @click="toggleMenu">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': menuActive }">
        <div class="navbar-start">
          <div class="navbar-item is-expanded tr">
            <p class="tr is-right">
              <router-link
                      v-if="auth.username"
                      to="/new"
                      class="button is-primary has-icon has-text-white">
                New Topic
              </router-link>
            </p>
            <p class="tr is-right">
              <router-link
                      v-if="auth.username"
                      to="/create-forum"
                      class="navbar-item is-primary">
                Create Forum
              </router-link>
            </p>
            <p class="tr is-right">
              <router-link
                      v-if="auth.admin"
                      to="/settings"
                      class="navbar-item is-primary">
                Settings
              </router-link>
            </p>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item is-expanded tr">
              <p v-if="auth.username" class="tr is-right">
                <AccountSwitcher></AccountSwitcher>
              </p>

              <p v-if="!auth.username" class="tr is-right">
                <a class="button is-primary has-text-white" @click="login">
                  Connect
                </a>
              </p>
          </div>
          <div v-if="auth.username" class="navbar-item is-expanded tr">
            <p class="tr is-right">
              <a class="navbar-item is-primary" @click="auth.addLink">
                Add Steem Account
              </a>
            </p>
            <p class="tr is-right">
              <a class="navbar-item is-primary" @click="logout">
                Logout
              </a>
            </p>
            <p class="tr is-right">
              <a class="navbar-item is-primary" target="_blank" v-bind:href="auth.manageLink">
                Manage
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

import AccountSwitcher from '@/components/AccountSwitcher.vue';

// import Avatar from '@/components/Avatar.vue';

export default {
  name: 'Navbar',
  components: {
    AccountSwitcher,

    // Avatar,
  },
  data() {
    return {
      menuActive: false,
    };
  },
  computed: {
    ...mapState( [ 'auth' ] ),
  },
  methods: {
    toggleMenu() {
      this.menuActive = !this.menuActive;
    },
    logout() {
      this.$store.commit( 'auth/logout' );
    },
    login() {
      this.$store.commit( 'auth/toggleAccountModal' );
    },
  },
};
</script>

<style scoped lang="scss">
</style>
