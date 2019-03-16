<template>
  <div id="app">
    <Navbar />
    <section v-if="loaded" class="section">
      <router-view />
    </section>
  </div>
</template>

<style lang="scss">
@import './themes/default.scss';
@import './themes/drugwars.scss';
@import './themes/monsters.scss';
@import './themes/lightmode.scss';
@import './themes/darkmode.scss';
</style>

<script>
import Navbar from './components/Navbar.vue';

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      loaded: false,
      theme: 'theme-default',
    };
  },
  mounted() {
    this.$nextTick( () => {
      this.$store.commit( 'auth/init', this.$store );

      this.$store
        .dispatch( 'categories/fetchAll' )
        .then( () => this.$store.dispatch( 'topics/fetchAll' ) )
        .then( () => {
          this.loaded = true;
        } );
    } );
  },
};
</script>
