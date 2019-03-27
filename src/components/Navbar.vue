<template>
  <nav
    class="navbar navstyle is-desktop"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="nav-logo navbar-brand">
      <router-link
        :to="{ path: '/' }"
        exact-active-class="noop"
        class="navbar-item"
      >
        <img class="logo">
      </router-link>
      <a
        role="button"
        class="navbar-burger navbar-right"
        :class="{ 'is-active': menuActive }"
        aria-label="menu"
        aria-expanded="false"
        @click="toggleMenu"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>
    <a id="topOfPage" />

    <div
      class="navbar-menu"
      :class="{ 'is-active': menuActive }"
    >
      <div class="navbar-start">
        <div class="navbar-item">
          <!--<p class="tr is-right">
              <router-link
                      v-if="auth.username"
                      to="/create-forum"
                      class="navbar-item is-primary">
                Create Forum
              </router-link>
            </p>-->
          <div>
            <a>
              <router-link
                v-if="auth.roles.admin"
                to="/settings"
              >
                Settings
              </router-link>
            </a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item is-expanded tr">
          <div class="nav-account">
            <p
              v-if="auth.username"
              class="tr is-right"
            >
              <AccountSwitcher />
            </p>
          </div>
          <div>
            <p
              v-if="!auth.username"
              class="tr is-right"
            >
              <button
                class="button is-small"
                @click="login"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        <b-dropdown
          v-if="auth.username"
          class="navbar-item is-right"
        >
          <button
            slot="trigger"
            class="button is-small"
            type="button"
          >
            <span>Account</span>
            <b-icon icon="menu-down" />
          </button>

          <b-dropdown-item
            class="is-right"
            @click="auth.addLink"
          >
            Add Steem Account
          </b-dropdown-item>
          <!-- disable for now till we habe better explanation
          <b-dropdown-item
            class="is-right"
            @click="toggleDarkMode"
          >
            Activate {{ darkMode ? 'Light' : 'Dark' }} Theme
          </b-dropdown-item>
          <b-dropdown-item
            class="is-right"
            @click="auth.autoMode"
          >
            Enable MB Auto Mode
          </b-dropdown-item>
          -->
          <b-dropdown-item
            class="is-right"
            target="_blank"
            :href="auth.manageLink"
          >
            Manage
          </b-dropdown-item>
          <b-dropdown-item
            class="is-right"
            @click="logout"
          >
            Logout
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

import Dropdown from 'buefy/src/components/dropdown/Dropdown';
import DropdownItem from 'buefy/src/components/dropdown/DropdownItem';
import Icon from 'buefy/src/components/icon/Icon';

import AccountSwitcher from './AccountSwitcher.vue';

export default {
  name: 'Navbar',
  components: {
    BDropdown: Dropdown,
    BDropdownItem: DropdownItem,
    BIcon: Icon,
    AccountSwitcher,
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
    },
  },
};
</script>

<style scoped lang="scss">
</style>
