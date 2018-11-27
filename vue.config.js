const { readFileSync } = require( 'fs' );
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
    plugins: [
      new DynamicCdnWebpackPlugin( {
        exclude: [ 'buefy' ],
        resolver: require( './scripts/resolveCDN' ),
        disable: process.env.NODE_ENV !== 'production',
      } ),
    ],
  },
};
