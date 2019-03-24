<template>
  <form
    class="new-reply"
    @submit.prevent="$emit('submit')"
  >
    <b-field>
      <TextEditor
        ref="editor"
        :fetching="fetching"
        @input="handleTextChange"
      />
    </b-field>

    <b-field>
      <div>
        <button
          class="button is-small is-topic"
          role="submit"
          :disabled="text.length == 0"
          :class="{ 'is-loading': fetching }"
        >
          Reply
        </button>
      </div>
    </b-field>
  </form>
</template>

<script>

import Field from 'buefy/src/components/field/Field';

import TextEditor from './TextEditor.vue';

export default {
  components: {
    BField: Field,
    TextEditor,
  },
  props: {
    fetching: Boolean,
    text: String,
    quote: String,
    quoteAuthor: String,
  },
  data() {
    return {
      content: '',
      customToolbar: [
        [ { 'header': [ 1, 2, 3, 4, 5, 6, false ] } ],
        [ 'bold', 'italic', 'underline' ],
        [ { 'list': 'ordered' }, { 'list': 'bullet' } ],
        [ 'code-block' ],
      ],
    };
  },
  methods: {
    handleTextChange( value ) {
      this.$emit( 'input', value );
    },
  },
};
</script>
