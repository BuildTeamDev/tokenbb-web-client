<template>
  <div class="container">
    <b-table
      :data="categoryList"
    >
      <template slot-scope="props">
        <b-collapse
          class="card"
          aria-id="contentIdForA11y3"
        >
          <div
            slot="trigger"
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">
              {{ props.row.title }}
            </p>
            <a class="card-header-icon">
              <b-icon
                :icon="props.open ? 'menu-down' : 'menu-down'"
              />
            </a>
          </div>
          <div class="card-content">
            <div class="content">
              <ul>
                <li>{{ props.row.slug }}</li>
                <li>{{ props.row.name }}</li>
                <li>{{ props.row.description }}</li>
              </ul>
            </div>
          </div>
        </b-collapse>

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
import Icon from 'buefy/src/components/icon/Icon';
import Collapse from 'buefy/src/components/collapse/Collapse';

export default {
  name: 'Categories',
  components: {
    BTable: Table,
    BIcon: Icon,
    BCollapse: Collapse,
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


