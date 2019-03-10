<template>
  <nav  id="nav" class="navbar" role="navigation" aria-label="main navigation">
    <div class="container">
      <a id="topOfPage" />
      <div class="navbar-brand">
        <div class="nav-logo navbar-item">
          <router-link
            :to="{ path: '/' }"
            exact-active-class="noop"
            class="navbar-item">
              <img class="logo"/>
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
            <!--<p class="tr is-right">
              <router-link
                      v-if="auth.username"
                      to="/create-forum"
                      class="navbar-item is-primary">
                Create Forum
              </router-link>
            </p>-->
          <div>
            <p>
              <router-link
                      v-if="auth.roles.admin"
                      to="/settings"
                      class="is-secondary">
                Settings
              </router-link>
              </p>
          </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item is-expanded tr">
            <div class="nav-account">
              <p v-if="auth.username" class="tr is-right">
                <AccountSwitcher></AccountSwitcher>
              </p>
            </div>
            <div class="nav-login">
              <p v-if="!auth.username" class="tr is-right">
                <a class="button is-primary" @click="login">
                  Connect
                </a>
              </p>
            </div>
          </div>
          <b-dropdown v-if="auth.username" class="navbar-item dropdown-style">
            <button class="button is-primary" type="button" slot="trigger">
              <span>Account</span>
              <b-icon icon="menu-down"></b-icon>
            </button>

            <b-dropdown-item class="is-right" @click="auth.addLink">
                Add Steem Account
            </b-dropdown-item>
            <b-dropdown-item class="is-right" @click="toggleDarkMode">
                Activate {{ darkMode ? 'Light' : 'Dark' }} Theme
            </b-dropdown-item>
            <b-dropdown-item class="is-right" @click="auth.autoMode">
                Enable MB Auto Mode
            </b-dropdown-item>
            <b-dropdown-item class="is-right" @click="logout">
                Logout
            </b-dropdown-item>
            <b-dropdown-item class="is-right" target="_blank" v-bind:href="auth.manageLink">
                Manage
            </b-dropdown-item>
          </b-dropdown>
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
      darkMode: true,
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
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.$root.$emit( `set-darkMode-${this.darkMode}` );
      console.log( this.darkMode );
    },
  },
};
</script>

<style scoped lang="scss">
</style>
