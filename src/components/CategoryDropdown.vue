<template>
  <b-dropdown @change="onChange">
    <button
      slot="trigger"
      class="button is-small"
      type="button"
    >
      <span v-html="selected ? selected.name : allCategories.name" />
      <b-icon icon="menu-down" />
    </button>

    <b-dropdown-item :value="allCategories">
      <span v-html="allCategories.name" />
    </b-dropdown-item>

    <b-dropdown-item
      v-for="category in categoryList"
      :key="category._id"
      :value="category"
    >
      <span v-html="category.name" />
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex';

import Dropdown from 'buefy/src/components/dropdown/Dropdown';
import DropdownItem from 'buefy/src/components/dropdown/DropdownItem';
import Icon from 'buefy/src/components/icon/Icon';

const ALL = { name: 'All Categories' };

export default {
  components: {
    BDropdown: Dropdown,
    BDropdownItem: DropdownItem,
    BIcon: Icon,
  },
  props: [
    'selectedId',
    'labelForAll',
  ],
  data() {
    return {
      selected: ALL,
      all: ALL,
    };
  },
  watch: {
    selectedId( value ) {
      this.selected = this.categoriesById[value];
    },
  },
  computed: {
    allCategories() {
      return this.labelForAll
        ? Object.assign( this.all, { name: this.labelForAll } )
        : this.all;
    },
    ...mapState( 'categories', [
      'fetching',
      'categoryList',
      'categoriesById',
    ] ),
  },
  methods: {
    onChange( value ) {
      this.$emit( 'change', value || null );
    },
  },
};
</script>
