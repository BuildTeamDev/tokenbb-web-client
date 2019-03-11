const BrotliPlugin = require( 'brotli-webpack-plugin' );
const CompressionPlugin = require( 'compression-webpack-plugin' );
const zopfli = require( '@gfx/zopfli' );

module.exports = {
  pwa: {
    workboxOptions: {
      importScripts: [ 'skip-waiting.js' ],
    },
  },
  configureWebpack: {
    plugins: [
      new BrotliPlugin( {
        asset: '[path].br[query]',
        test: /\.(js|css|html|svg)$/,
        threshold: 0,
        minRatio: 0.8,
      } ),
      new CompressionPlugin( {
        compressionOptions: {
          numiterations: 15,
        },
        test: /\.(js|css|html|svg)$/,
        filename: '[path].gz[query]',
        algorithm( input, compressionOptions, callback ) {
          return zopfli.gzip( input, compressionOptions, callback );
        },
      } ),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  },
};
