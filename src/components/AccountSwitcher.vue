<template>
  <b-dropdown
    class="is-right"
    @change="onChange"
  >
    <button
      slot="trigger"
      class="button is-small"
      type="button"
    >
      <Avatar
        :author="current"
        :owner="id"
        size="small"
      />&nbsp;
      {{ current | usernameDisplay(id) }} <b-icon icon="menu-down" />
    </button>

    <b-dropdown-item :value="all">
      <Avatar
        :author="all.account"
        :owner="id"
        size="small"
      />&nbsp;
      {{ all.account | usernameDisplay(id) }}
    </b-dropdown-item>

    <b-dropdown-item
      v-for="(account, index) in accounts"
      :key="index"
      :value="account"
    >
      <Avatar
        :author="account.account"
        size="small"
      />&nbsp;
      <b-icon
        v-if="account.authority.posting"
        icon="check-circle"
        type="is-success"
      />
      <b-icon
        v-else
        icon="alert-circle"
        type="is-danger"
      />
      {{ account.account }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex';
import Dropdown from 'buefy/src/components/dropdown/Dropdown';
import DropdownItem from 'buefy/src/components/dropdown/DropdownItem';
import Icon from 'buefy/src/components/icon/Icon';

import Avatar from './Avatar.vue';

const ALL = { account: process.env.VUE_APP_ANON_USER, 'authority': { 'posting': true } };

export default {
  components: {
    Avatar,
    BDropdown: Dropdown,
    BDropdownItem: DropdownItem,
    BIcon: Icon,
  },
  data() {
    return {
      selected: ALL,
      all: ALL,
    };
  },
  computed: {
    ...mapState( 'auth', [
      'accounts',
      'current',
      'id',
    ] ),
  },
  methods: {
    onChange( value ) {
      console.log( value );
      if ( value.authority.posting ) {
        this.selected = value;
        this.$store.commit( 'auth/setCurrent', value.account );
      } else {
        window.BTSSO.authorizePosting( value.account );
        this.$store.commit( 'auth/setCurrent', this.selected.account );
        this.selected = this.selected;
      }
    },
  },
};
</script>
