import Koa from 'koa';
import serve from 'koa-static';
import send from 'koa-send';

const port = process.env.PORT || 3000;
const app = new Koa();

/* force https */
app.use( async ( ctx, next ) => {
  if ( process.env.NODE_ENV === 'production' && ( ctx.request.headers['x-forwarded-proto'] !== 'https' ) ) {
    return ctx.redirect( ctx.request.href.replace( 'http://', 'https://' ) );
  }
  return await next();
} );

app.use( serve( 'dist', {
  gzip: true,
  br: true,
} ) );

/* serve index.html for all 404 routes */
app.use( async ( ctx ) => {
  await send( ctx, 'dist/index.html' );
} );

async function server() {

  /* Finally, start the server */
  await app.listen( port );

  /* Yay */
  console.log( 'Server listening on port', port );
}

server().catch( ( err ) => {
  console.error( err );
  process.exit( 1 );
} );
