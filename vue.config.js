const webpack = require( 'webpack' );
const BrotliPlugin = require( 'brotli-webpack-plugin' );
const CompressionPlugin = require( 'compression-webpack-plugin' );
const zopfli = require( '@gfx/zopfli' );
const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;

let webpackPlugins = [
  new webpack.IgnorePlugin( /^\.\/locale$/, /moment$/ ),
];
const isProd = process.env.NODE_ENV === 'production';
const onlyBR = process.env.BR;
console.info( `Server is prod: ${isProd} onlyBR: ${onlyBR}` );
if ( isProd ) {
  if ( onlyBR ) {
    webpackPlugins.push( new BrotliPlugin( {
      asset: '[path].br[query]',
      test: /\.(js|css|html)$/,
      threshold: 0,
      minRatio: 0.8,
      deleteOriginalAssets: true,
    } ) );
  } else {
    webpackPlugins = webpackPlugins.concat(
      [
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
        new BundleAnalyzerPlugin( {
          defaultSizes: 'parsed',
          analyzerMode: 'static',
          openAnalyzer: false,
        } ),
      ]
    );
  }
} else {
  webpackPlugins.push( new BundleAnalyzerPlugin( {
    defaultSizes: 'parsed',
    analyzerMode: 'server',
    openAnalyzer: false,
  } ) );
}

module.exports = {
  pwa: {
    workboxOptions: {
      importScripts: [ 'skip-waiting.js' ],
    },
  },
  configureWebpack: {
    plugins: webpackPlugins,
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '_',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  },
};

if ( isProd && onlyBR ) {
  module.exports.configureWebpack.output = {
    filename: '[name].js',
    chunkFilename: '[name].js',
  };
  module.exports.css = {
    extract: {
      filename: '[name].css',
      chunkFilename: '[name].css',
    },
  };
}
