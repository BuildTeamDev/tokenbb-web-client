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
        <img
          class="logo"
          :src="logo"
        >
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
      <div class="navbar-end">
        <div class="navbar-item is-expanded tr">
          <router-link :to="{ path: 'forums' }">
            <b-icon
              icon="compass"
              size="is-large"
              title="Forum Explorer – find out about other forums you might like!"
            />
          </router-link>
        </div>
        <table
          v-if="auth.username"
          class="progress-table"
        >
          <tr>
            <td
              rowspan="2"
            >
              <img
                class="steem-icon"
                src="../assets/steemIcon.png"
              >
            </td>
            <td>
              <p class="progress-label">
                vp
              </p>
            </td>
            <td>
              <p class="progress-percentage">
                {{ Math.round(auth.vp) + '%' }}
              </p>
            </td>
            <td>
              <div class="progress">
                <div
                  :title="`Voting Power: ${auth.vp}%\nIndicates how powerful your vote is.`"
                  class="progress-bar"
                  :style="{width: auth.vp + '%'}"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <p class="progress-label">
                rc
              </p>
            </td>
            <td>
              <p class="progress-percentage">
                {{ Math.round(auth.rc) + '%' }}
              </p>
            </td>
            <td>
              <div class="progress">
                <div
                  :title="`Resource Credits: ${auth.rc}%\nIndicates how many transactions you can still make.`"
                  class="progress-bar"
                  :style="{width: auth.rc + '%'}"
                />
              </div>
            </td>
          </tr>
          <tr v-if="forum.token.enabled">
            <td>
              <img
                class="token-icon"
                :src="forum.token.icon"
              >
            </td>
            <td>
              <p class="progress-label">
                vp
              </p>
            </td>
            <td>
              <p class="progress-percentage">
                {{ Math.round(auth.scotVp) + '%' }}
              </p>
            </td>
            <td>
              <div class="progress">
                <div
                  :title="`${forum.token.symbol} Voting Power: ${auth.scotVp}%\nIndicates how powerful your vote is.`"
                  class="progress-bar"
                  :style="{width: auth.scotVp + '%'}"
                />
              </div>
            </td>
          </tr>
        </table>
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
            v-if="auth.roles.admin"
          >
            <router-link
              :to="{ path: '/admin/permissions' }"
              exact-active-class="noop"
              tag="span"
            >
              Forum Settings
            </router-link>
          </b-dropdown-item>
          <b-dropdown-item
            class="is-right"
            @click="auth.addLink"
          >
            Add Steem Account
          </b-dropdown-item>
          <!-- disable for now till we habe better explanation
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
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLScC0Sop2dd46ukA3W3uVRswK0zihXlPHKb_ng5QdjQ9yoxOXQ/viewform"
          >
            Order a forum
          </b-dropdown-item>
          <b-dropdown-item
            class="is-right"
            target="_blank"
            href="https://shop.buildteam.io/product-category/tokenbb/"
          >
            Upgrade your forum
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
import { mapState, mapGetters } from 'vuex';

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
    };
  },
  computed: {
    ...mapState( [
      'auth',
      'forum',
    ] ),
    logo() {
      return global.logo;
    },
  },
  created() {
    this.timer = setInterval( this.updateVpRcBars, 60000 );
  },
  beforeDestroy() {
    clearInterval( this.timer );
  },
  methods: {
    updateVpRcBars() {
      this.$store.dispatch( 'auth/getVpRcBars' );
    },
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
