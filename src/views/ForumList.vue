<template>
  <div class="container home">
    <div>
      <div class="card-content">
        <div class="content">
          <b-table
            :loading="fetching"
            :data="forumList"
            class=""
            :paginated="true"
            :per-page="10"
            default-sort-direction="desc"
            default-sort="meta.views"
          >
            <template slot-scope="cprops">
              <b-table-column
                field="name"
                label="Name"
                class="card"
                sortable
              >
                <template
                  slot="header"
                  slot-scope="{ column }"
                >
                  <div class="">
                    <span>{{ column.label }}</span>
                  </div>
                </template>
                <div class="column is-half cat-title">
                  <a
                    :href="cprops.row.domains && cprops.row.domains.length > 1 ? cprops.row.domains[0] : cprops.row.steem.canonical"
                    target="_blank"
                    class="cprops-title"
                  >{{ cprops.row.name }}</a><br>
                  <span class="cprops-description">{{ cprops.row.description }}</span>
                </div>
              </b-table-column>
              <b-table-column
                field="meta.topics"
                label="Topics"
                class="card"
                sortable
              >
                <template
                  slot="header"
                  slot-scope="{ column }"
                >
                  <div class="">
                    <span>{{ column.label }}</span>
                  </div>
                </template>
                <div class="column cat-stats">
                  <span>{{ cprops.row.meta ? cprops.row.meta.topics : '' }} Topics</span>
                </div>
              </b-table-column>
              <b-table-column
                field="meta.views"
                label="Views"
                class="card"
                sortable
              >
                <template
                  slot="header"
                  slot-scope="{ column }"
                >
                  <div class="">
                    <span>{{ column.label }}</span>
                  </div>
                </template>
                <div class="column cat-stats">
                  <span>{{ cprops.row.meta ? cprops.row.meta.views : '' }} Views</span>
                </div>
              </b-table-column>
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex';

import Table from 'buefy/src/components/table/Table';
import TableColumn from 'buefy/src/components/table/TableColumn';

export default {
  name: 'ForumList',
  components: {
    BTable: Table,
    BTableColumn: TableColumn,
  },
  computed: {
    ...mapState( 'forum', [
      'forumList',
      'fetching',
    ] ),
  },
  beforeRouteUpdate( to, from, next ) {
    const page = to.query.page ? to.query.page : 1;
    const pageSize = to.query.page_size ? to.query.page_size : null;
    this.$store.dispatch( 'forum/fetchForums', { page, pageSize } );
    next();
  },
};
</script>

