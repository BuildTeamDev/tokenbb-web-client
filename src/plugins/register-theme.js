export default function ( ) {
  const { VUE_APP_BASE_PATH, VUE_APP_STACK_NAME, NODE_ENV } = process.env;
  const subdomain = getSubdomain();

  const contextMap = {
    development: {
      theme: `theme-${VUE_APP_STACK_NAME}`,
      forum: VUE_APP_STACK_NAME,
      icon: VUE_APP_STACK_NAME ? `favicon_${VUE_APP_STACK_NAME}.png` : 'favicon.ico',
    },
    production: {
      theme: `theme-${subdomain}`,
      forum: subdomain,
      icon: subdomain ? `favicon_${subdomain}.png` : 'favicon.ico',
    },
  };

  const context = contextMap[NODE_ENV];

  // TODO: load it in `Vue.extend( { mounted() {/*here*/} } )` if it's work
  console.log( `Loading TokenBB on ${context.forum} with ${context.theme}` );
  setLink( 'stylesheet', `css/${context.theme}.css` );
  setLink( 'icon', context.icon );
  document.documentElement.className = `${context.theme}`;
  global.forumname = context.forum; // 👈 need to revisit this later, seems dangerous 🤔

  // ⚠️Reminder⚠️ don't register theme or icon in public.html
  function setLink( type, refPath ) {
    const link = document.createElement( 'link' );
    link.rel = type;
    link.href = refPath; // 👈 do you plan to store the theme on monsters.tokenbb.bt-stage.com or tokenbb.bt-stage.com?
    document.getElementsByTagName( 'head' )[0].appendChild( link );
  }

  function getSubdomain() {
    const subs = location.hostname.split( '.' ); // ['monsters', 'tokenbb', 'com']
    const bases = VUE_APP_BASE_PATH.split( '.' ); // ['tokenbb', 'com']
    if ( subs[1] === bases[0] ) {
      return subs[0];
    }
  }
}
