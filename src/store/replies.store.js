import { createReply } from '../services/post.service.js';

export default {
  namespaced: true,
  state: {
    fetching: false,
  },
  mutations: {
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    setFetching( state, fetching ) {
      state.fetching = fetching;
    },
  },
  actions: {
    submitReply( { commit }, { parentComment, content } ) {
      commit( 'setFetching', true );

      const author = this.state.auth.current;

      return createReply( parentComment, author, content )
        .then( ( reply ) => {
          commit( 'setFetching', false );

          return reply;
        } )
        .catch( ( err ) => {
          commit( 'setFetching', false );

          throw err;
        } );
    },
  },
};
