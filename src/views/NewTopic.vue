<template>
  <div class="container fill">
    <h2 class="title is-2">Create a New Topic</h2>

    <form @submit.prevent="onSubmit" class="new-topic">
      <div class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <b-field label="Title">
              <b-input v-model="title" placeholder="Type title here">
              </b-input>
            </b-field>
          </div>

          <div class="level-item">
            <b-field label="Category">
              <CategoryDropdown
                @change="onSelectCategory"
                :selectedId="selectedCategory ? selectedCategory._id : null"
                :labelForAll="'Uncategorized'">
              </CategoryDropdown>
            </b-field>
          </div>
        </div>
      </div>

      <b-field label="Message">
        <TextEditor
          :fetching="fetching"
          @input="handleTextChange">
        </TextEditor>
      </b-field>

      <div class="field">
        <div class="control">
          <button role="submit"
            :class="{ 'is-loading': fetching }"
            class="button is-primary">
            Create Topic
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import TextEditor from '@/components/TextEditor.vue';
import CategoryDropdown from '@/components/CategoryDropdown.vue';
import { mapState } from 'vuex';

export default {
  name: 'new-topic',
  components: {
    TextEditor,
    CategoryDropdown,
  },
  data() {
    return {
      fetching: false,
      selectedCategory: null,
      title: '',
      content: '',
    };
  },
  computed: {
    ...mapState( 'categories', [
      'categoriesById',
    ] ),
  },
  methods: {
    onSubmit() {
      if ( !this.selectedCategory ) {
        return this.$toast.open( {
          type: 'is-danger',
          message: 'Please select a category',
        } );
      }

      const payload = {
        title: this.title,
        category: this.selectedCategory.slug,
        content: this.content,
      };

      this.fetching = true;

      this.$store.dispatch( 'topics/createTopic', payload )
        .then( () => {
          this.$router.push( '/' );
          this.$toast.open( {
            message: 'Your topic has been posted.',
            type: 'is-primary',
          } );
        } )
        .catch( ( err ) => {
          console.error( err );
          this.$toast.open( {
            message: 'Oops! Could not create your topic at this moment.',
            type: 'is-danger',
          } );
          this.fetching = false;
        } );
    },
    onSelectCategory( selectedId ) {
      this.selectedCategory = selectedId;
    },
    handleTextChange( text ) {
      this.content = text;
    },
  },
};
</script>
