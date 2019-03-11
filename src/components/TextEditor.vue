<template>
    <steem-editor v-model="content" language="en" :toolbars="customToolbar"/>
</template>

<script>

export default {
  props: {
    fetching: Boolean,
    initialContent: String,
  },
  data() {
    return {
      content: this.initialContent,
      customToolbar: {
        header: true,
        bold: true,
        italic: true,
        underline: true,
        li: true,
        ol: true,
        fullscreen: true,
        subfield: true,
        preview: true,
      },
    };
  },
  watch: {
    content() {
      this.$emit( 'input', this.content );
    },
  },
  created() {
    this.$root.$on( 'quote-click', addQuote );

    function addQuote( d ) {
      this.content += `\n> @${ d.author.user }:\n${ d.body.replace( /^/gm, '> ' ) }\n---\n`;
    }
  },
};
</script>
