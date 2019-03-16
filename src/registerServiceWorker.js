// maybe fix?
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { register } from 'register-service-worker';
import { Snackbar } from 'buefy/dist/components/snackbar';

export const registerSW = () => {
  if ( process.env.NODE_ENV === 'production' ) {
    register( `${process.env.BASE_URL}service-worker.js`, {
      ready() {
        console.info( 'Service worker is active.' );
      },
      registered( registration ) {
        console.info( 'Service worker has been registered.' );
      },
      cached( registration ) {
        console.info( 'Content has been cached for offline use.' );
      },
      updatefound( registration ) {
        console.info( 'New content is downloading.' );
      },
      updated( registration ) {
        console.info( 'New content is available; please refresh.' );

        let refreshing;
        navigator.serviceWorker.addEventListener( 'controllerchange', () => {
          if ( refreshing ) {
            return;
          }
          refreshing = true;
          window.location.reload();
        } );

        Snackbar.open( {
          message: 'A new version of this web app is available, please refresh the page to update.',
          type: 'is-warning',
          position: 'is-bottom-left',
          actionText: 'Refresh',
          indefinite: true,
          onAction: () => {
            registration.waiting.postMessage( 'skipWaiting' );
          },
        } );
      },
      offline() {
        console.warn( 'No internet connection found. App is running in offline mode.' );
      },
      error( error ) {
        console.error( 'Error during service worker registration:', error );
      },
    } );
  }
};
