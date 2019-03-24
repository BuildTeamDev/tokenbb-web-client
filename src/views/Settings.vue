<template>
  <div class="container setting-view">
    <p>Settings</p>

    <h3 class="title">
      Categories
    </h3>

    <b-table
      class="setting-page"
      :data="categoryList"
      mobile-cards
    >
      <template slot-scope="props">
        <b-table-column
          field="slug"
          label="Slug"
        >
          {{ props.row.slug }}
        </b-table-column>

        <b-table-column
          field="name"
          label="Name"
        >
          {{ props.row.name }}
        </b-table-column>
        <b-table-column
          field="title"
          label="Title"
        >
          {{ props.row.title }}
        </b-table-column>
        <b-table-column
          field="description"
          label="Description"
        >
          {{ props.row.description }}
        </b-table-column>
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

    <hr>

    <h3 class="title">
      Add a category
    </h3>

    <form @submit.prevent="add">
      <b-field label="Category Name">
        <b-input
          v-model="name"
          :maxlength="32"
          :has-counter="false"
          :disabled="fetching"
        />
      </b-field>

      <b-field label="Category Title">
        <b-input
          v-model="title"
          :maxlength="32"
          :has-counter="false"
          :disabled="fetching"
        />
      </b-field>

      <b-field label="Category Description">
        <b-input
          v-model="description"
          :maxlength="320"
          :has-counter="false"
          :disabled="fetching"
        />
      </b-field>

      <button
        role="submit"
        class="button is-small"
        :class="{ 'is-loading': fetching }"
        :disabled="fetching"
      >
        Add Category
      </button>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Table from 'buefy/src/components/table/Table';
import TableColumn from 'buefy/src/components/table/TableColumn';
import Field from 'buefy/src/components/field/Field';
import Input from 'buefy/src/components/input/Input';

export default {
  name: 'Settings',
  components: {
    BTable: Table,
    BTableColumn: TableColumn,
    BField: Field,
    BInput: Input,
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
  methods: {
    add() {
      this.$store.dispatch( 'categories/add', {
        name: this.name,
        title: this.title,
        description: this.description,
      } )
        .then( () => {
          this.name = '';
          this.title = '';
          this.description = '';
          this.$store.dispatch( 'categories/fetchAll' );
        } )
        .catch( ( err ) => {
          console.error( err );
          this.fetching = false;
        } );
    },
    remove( category ) {
      this.$store.dispatch( 'categories/remove', category )
        .then( () => this.$store.dispatch( 'categories/fetchAll' ) )
        .catch( ( err ) => {
          console.error( err );
          this.fetching = false;
        } );
    },
  },
};
</script>
