/* eslint-disable prefer-arrow/prefer-arrow-functions */
// eslint-disable-next-line no-shadow
import { forEach, find } from 'lodash';
import { Toast } from 'buefy/dist/components/toast';

import { createTopic, listTopics } from '../services/post.service.js';
import { errorAlertOptions } from '../utils/notifications.js';

const withPinnedToTop = ( topics ) => {
  const pinned = [];
  const notPinned = [];

  forEach( topics, ( topic ) => {
    return topic.pinned ? pinned.push( topic ) : notPinned.push( topic );
  } );

  notPinned.sort( ( a, b ) => {
    return b.lastUpdate - a.lastUpdate;
  } );

  return pinned.concat( notPinned );
};

export default {
  namespaced: true,
  state: {
    fetching: true,
    topicList: [],
  },
  mutations: {
    reorder( state ) {
      state.topicList = withPinnedToTop( state.topicList );
    },
    pin( state, topic ) {
      const pinned = find( state.topicList, [ 'id', topic.id ] );

      pinned.pinned = true;

      this.commit( 'topics/reorder' );
      this.dispatch( 'topics/fetchAll' );
    },
    unpin( state, topic ) {
      const pinned = find( state.topicList, [ 'id', topic.id ] );

      pinned.pinned = false;

      this.commit( 'topics/reorder' );
      this.dispatch( 'topics/fetchAll' );
    },
    setFetching( state, fetching ) {
      state.fetching = fetching;
    },
    updateTopicList( state, topics ) {
      state.topicList = topics;
    },
    addTopic( state, topic ) {
      state.topicList.push( topic );
    },
  },
  actions: {
    createTopic( { commit }, { title, category, content } ) {
      const author = this.state.auth.current;

      return createTopic( author, category, title, content ).then( ( topic ) => {
        console.info( topic );
        if ( !topic.success ) {
          throw new Error( topic.message );
        }
        commit( 'addTopic', topic.data );

        return topic.data;
      } );
    },
    fetchAll( { commit } ) {
      commit( 'setFetching', true );

      listTopics( null )
        .then( ( topics ) => {
          commit( 'updateTopicList', withPinnedToTop( topics ) );
          commit( 'setFetching', false );
        } )
        .catch( ( err ) => {
          commit( 'setFetching', false );
          Toast.open( errorAlertOptions( 'Error fetching topics ', err ) );
          console.error( err );
        } );
    },
  },
};
