const { readFileSync } = require( 'fs' );
const webpack = require( 'webpack' );
const DynamicCdnWebpackPlugin = require( 'dynamic-cdn-webpack-plugin' );

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
      maxEntrypointSize: 3000000, // TODO: need to hunt down the bloated package in the future 🔫
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 200000,
        maxSize: 290000,
      },
    },
    plugins: [
      new webpack.IgnorePlugin( /^\.\/locale$/, /moment$/ ),
      new DynamicCdnWebpackPlugin( {
        exclude: [ 'buefy' ],
        resolver: require( './scripts/resolveCDN' ),
        disable: process.env.NODE_ENV !== 'production',
      } ),
    ],
  },
};
