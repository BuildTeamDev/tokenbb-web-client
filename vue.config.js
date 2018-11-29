const { readFileSync } = require( 'fs' );
const { join } = require( 'path' );
const webpack = require( 'webpack' );
const DynamicCdnWebpackPlugin = require( 'dynamic-cdn-webpack-plugin' );
const PurgecssPlugin = require( 'purgecss-webpack-plugin' );
const { sync } = require( 'glob-all' );

const maxChunkSize = 290000; // because vue2-editor is about this size and can't be tree-shaken

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: readFileSync( 'src/themes/global/variables.scss', 'utf-8' ),
      },
    },
  },

  configureWebpack: {
    performance: {
      maxAssetSize: maxChunkSize,
      maxEntrypointSize: 3000000, // TODO: need to hunt down the bloated package in the future 🔫
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 200000,
        maxSize: maxChunkSize,
      },
    },
    plugins: [
      new webpack.IgnorePlugin( /^\.\/locale$/, /moment$/ ),
      new PurgecssPlugin( {
        paths: sync( [
          join( __dirname, './public/index.html' ),
          join( __dirname, './src/**/*.vue' ),
          join( __dirname, './src/**/*.js' ),
        ] ),
      } ),
      new DynamicCdnWebpackPlugin( {
        exclude: [ 'buefy' ],
        resolver: require( './scripts/resolveCDN' ),
        disable: process.env.NODE_ENV !== 'production',
      } ),
    ],
  },
};
