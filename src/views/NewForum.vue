<template>
  <div class="container">
    <h2 class="title is-2">
      Create a New Forum
    </h2>

    <form
      class="new-forum"
      @submit.prevent="onSubmit"
    >
      <b-field label="Name">
        <b-input
          v-model="name"
          placeholder="Type name here"
        />
      </b-field>
      <b-field label="Admin">
        <b-input
          v-model="admin"
          placeholder="Add admin bt user"
        />
      </b-field>
      <button
        role="submit"
        :class="{ 'is-loading': fetching }"
        class="button is-primary"
      >
        Create Forum
      </button>
    </form>
  </div>
</template>

<script>

import Field from 'buefy/src/components/field/Field';
import Input from 'buefy/src/components/input/Input';

import { createForum } from '../services/api.service.js';

import { Toast } from 'buefy/dist/components/toast';

export default {
  name: 'NewForum',
  components: {
    BField: Field,
    BInput: Input,
  },
  data() {
    return {
      fetching: false,
      name: '',
      admin: '',
    };
  },
  methods: {
    onSubmit() {
      if ( this.name.length < 1 ) {
        return Toast.open( {
          type: 'is-danger',
          message: 'Please write a forum name',
        } );
      }

      this.fetching = true;

      createForum( this.name, this.admin )
        .then( ( forum ) => {
          window.location = `https://${forum.data.slug}.${process.env.VUE_APP_BASE_PATH}/settings`;
        } )
        .catch( ( err ) => {
          console.error( err );
          Toast.open( {
            message: 'Oops! Could not create your forum at this moment. ' + err,
            type: 'is-danger',
          } );
          this.fetching = false;
        } );
    },
  },
};
</script>
