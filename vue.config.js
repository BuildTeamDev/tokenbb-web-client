/* eslint-disable curly */
const { readFileSync } = require( 'fs' );
const { join, resolve, parse } = require( 'path' );
const webpack = require( 'webpack' );
const DynamicCdnWebpackPlugin = require( 'dynamic-cdn-webpack-plugin' );
const PurgecssPlugin = require( 'purgecss-webpack-plugin' );
const { sync: glob } = require( 'glob-all' );

const maxChunkSize = 290000; // vue2-editor is about this size
const { VUE_APP_STACK_NAME, NODE_ENV, FORUM_TITLE } = process.env;

module.exports = {
  filenameHashing: false,
  css: {
    loaderOptions: {
      sass: {
        data: readFileSync( 'src/themes/global/variables.scss', 'utf-8' ),
      },
    },
  },

  chainWebpack( config ) {
    function registerTheme( themePath ) {
      const theme = parse( themePath );
      const styleLoader = config.module.rule( theme.ext.substring( 1 ) ).oneOf( 'normal' ).toConfig();
      styleLoader.use.shift(); // remove vue-style-loader
      styleLoader.use.unshift( {
        loader: 'extract-loader',
      } );

      config.module.rule( theme.name ).test( themePath ).merge( styleLoader );
      config.entry( 'theme.' + theme.name ).add( themePath );
    }

    // #region Exclude themes being added to index.html to support injecting custom theme
    config.plugin( 'exclude-assets' ).use( require( 'html-webpack-exclude-assets-plugin' ) );
    config.plugin( 'html' ).tap( ( options ) => {
      options[0].title = FORUM_TITLE;
      options[0].excludeAssets = [ /theme.*.css/, /theme.*.js/ ];
      return options;
    } );

    // #endregion

    // #region Compile all themes if in production mode
    config.when( NODE_ENV === 'production', () => { // if yes
      glob( './src/themes/*.scss' ).forEach(
        ( path ) => registerTheme( resolve( path ) )
      );
    }, () => { // if no
      registerTheme( resolve( `./src/themes/${VUE_APP_STACK_NAME || 'default'}.scss` ) );
    } );

    // #endregion
  },

  configureWebpack: {
    performance: {
      maxAssetSize: maxChunkSize,
      maxEntrypointSize: 3000000, // TODO: need to hunt down the bloated package in the future 🔫
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            minSize: 200000,
            maxSize: maxChunkSize,
          },
        },
      },
    },
    plugins: [
      new webpack.IgnorePlugin( /^\.\/locale$/, /moment$/ ), // TODO: replace momentjs with native js implementation
      new PurgecssPlugin( {
        rejected: true, // print the removed class style on webpack stats
        paths: glob( [
          join( __dirname, './public/index.html' ),
          join( __dirname, './src/**/*.vue' ),
          join( __dirname, './node_modules/buefy/**/*.vue' ), // TODO: remove/modify this after second refactoring
          join( __dirname, './src/**/*.js' ),
        ], { nodir: true } ),
      } ),
      new DynamicCdnWebpackPlugin( {
        exclude: [ 'buefy' ],
        resolver: require( './scripts/resolveCDN' ),
        disable: process.env.NODE_ENV !== 'production',
      } ),
    ],
  },
};
