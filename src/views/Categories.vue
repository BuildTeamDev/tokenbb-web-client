<template>
  <div class="container">
    <b-table
      :data="categoryList"
    >
      <template slot-scope="props">
        {{ props.row.slug }}

        {{ props.row.name }}

        {{ props.row.title }}

        {{ props.row.description }}
        <!--
        <b-table-column label="Delete" centered>

          <a class="button is-small"
            :class="{ 'is-loading': fetching }"
            @click="remove(props.row.id)">
            <b-icon
              icon="close-circle"
              size="is-small">
            </b-icon>
          </a>
        </b-table-column>
        -->
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Table from 'buefy/src/components/table/Table';

export default {
  name: 'Categories',
  components: {
    BTable: Table,
  },
  data() {
    return {
      name: '',
      title: '',
      description: '',
    };
  },
  computed: {
    ...mapState( 'categories', [
      'categoryList',
      'fetching',
    ] ),
  },
};
</script>


