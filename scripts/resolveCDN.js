/* eslint-disable curly */
const moduleToCdn = require( 'module-to-cdn' );
const pkg = require( '../package.json' );

// eslint-disable-next-line
String.prototype.pascalCase = function () {
  return this.replace( /\w+/g,
    ( w ) => {
      return w[0].toUpperCase() + w.slice( 1 ).toLowerCase();
    } );
};

module.exports = ( pkgName, pkgVersion ) => {
  const version = pkgVersion.replace( '^', '' );
  const cdnVersion = pkgVersion[0] === '^' ? '' : `@${version}`;

  const mainDeps = Object.keys( pkg.dependencies );

  if ( mainDeps.includes( pkgName ) ) {
    const mod = moduleToCdn( pkgName, version, { env: process.env.NODE_ENV } );
    if ( mod ) return mod;

    const pkgMod = require( `${pkgName}/package.json` );
    let umdPath;
    let cdnUrl = 'https://cdn.jsdelivr.net/npm';
    if ( typeof pkgMod.browser === 'string' ) umdPath = pkgMod.browser;
    else if ( typeof pkgMod.jsdelivr === 'string' ) umdPath = pkgMod.jsdelivr;
    else if ( typeof pkgMod.unpkg === 'string' ) {
      umdPath = pkgMod.unpkg;
      cdnUrl = 'https://unpkg.com';
    }

    if ( umdPath && !Array.isArray( umdPath ) ) {
      if ( process.env.NODE_ENV === 'production' ) umdPath = umdPath.replace( '.js', '.min.js' );
      return {
        name: pkgName,
        var: pkgName.pascalCase().replace( '-', '' ),
        url: `${cdnUrl}/${pkgName}${cdnVersion}/${umdPath}`,
        version,
      };
    } return null;
  } return null;
};
