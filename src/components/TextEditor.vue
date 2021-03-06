<template>
  <div>
    <steem-editor
      ref="md"
      v-model="content"
      language="en"
      :toolbars="customToolbar"
      :autofocus="autofocus"
      default-open="edit"
      @imgAdd="uploadEditorImage"
    />
    <div class="container post">
      <div class="box is-mobile">
        <div class="media-content">
          <!-- eslint-disable vue/no-v-html -->
          <article
            class="content"
            v-html="$renderMD(content)"
          />
          <!-- eslint-enable -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { uploadImage } from '../services/api.service.js';
import { quoteText } from '../utils/content';
import { localStorageGetItem, localStorageSetItem } from '../utils/localStorage';

export default {
  props: {
    fetching: Boolean,
    initialContent: { type: String, default: '' },
  },
  data() {
    return {
      content: this.initialContent,
      autofocus: false,
      customToolbar: {

        // Disabled because confusing
        subfield: false,
        preview: false,
        fullscreen: false,
        trash: false,
        save: false,
        readmodel: false,
        htmlcode: false,

        // disabled because renderer does not support
        mark: false,
        superscript: false,
        subscript: false,
        alignleft: false,
        aligncenter: false,
        alignright: false,

        // enabled because renderer supports
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,

        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        code: true,
        table: true,
        help: true,
        undo: true,
        redo: true,
        navigation: true,

      },
    };
  },
  watch: {
    content() {
      this.$emit( 'input', this.content );
    },
  },
  async created() {
    this.$root.$on( 'quote-click', this.addQuote );
    const text = await localStorageGetItem( this.$route.fullPath );
    if ( !text || text === 'null' ) {
      await localStorageSetItem( this.$route.fullPath, this.content );
    } else {
      this.content = text;
    }
  },
  methods: {
    addQuote( quote ) {
      this.content += quoteText( quote );
    },
    uploadEditorImage( pos, file ) {
      const newPos = `Uploading File ${pos}, please wait...`;
      this.$refs.md.$img2Url( pos, newPos );
      uploadImage( file ).then( ( url ) => {
        const newUrl = url.success ? url.data.url : url.message;
        const regStr = '/(!\\[\[^\\[\]*?\\]\(?=\\(\)\)\\(\\s*\(' + newPos + '\)\\s*\\)/g';
        // eslint-disable-next-line no-eval
        const reg = eval( regStr );
        this.$refs.md.d_value = this.$refs.md.d_value.replace( reg, '$1(' + newUrl + ')' );
        this.$refs.md.$refs.toolbar_left.$changeUrl( pos, newUrl );
        this.$refs.md.iRender();
      } );
    },
  },
};
</script>
