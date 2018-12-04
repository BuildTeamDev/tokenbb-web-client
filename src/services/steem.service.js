import steem from '@steemit/steem-js';
import { promisify } from 'util';

class SteemService {
  constructor() {
    this.token = null;
  }

  getContent( author, permlink ) {
    return new Promise( ( ( resolve, reject ) => {
      steem.api.getContent( author, permlink, ( err, result ) => {
        if ( err ) {
          return reject( err );
        }
        resolve( result );
      } );
    } ) );
  }

  getTopic( author, permlink ) {
    const path = `/tokenbb-${global.forumname}-topics/@${author}/${permlink}`;

    return steem.api.callAsync( 'get_state', [ path ] )
      .then( ( res ) => {
        const topic = res.content[`${author}/${permlink}`];

        topic.metadata = JSON.parse( topic.json_metadata );
        topic.replies = topic.replies.map( ( _permlink ) => res.content[_permlink] );

        return topic;
      } );
  }

  broadcastPatch( post ) {
    const args = [
      post.parent_author,
      post.parent_permlink,
      post.author,
      post.permlink,
      post.title,
      post.content,
      post.metadata,
    ];

    return this._broadcast( args );
  }

  vote( author, permlink, weight = 0.01 ) {
    // eslint-disable-next-line no-param-reassign
    weight *= 100; // weight 1 to 10000 (100%)

    return new Promise( async ( resolve, reject ) => {
      const { account } = await this.me();

      this.connect.vote( account.name, author, permlink, weight, ( err, res ) => {
        if ( err ) {
          return reject( err );
        }

        return resolve( res );
      } );
    } );
  }

  me() {
    return new Promise( ( resolve, reject ) => {
      this.connect.me( ( err, res ) => {
        if ( err ) {
          return reject( err );
        }

        return resolve( res );
      } );
    } );
  }
  _broadcast( args ) {
    const broadcastFn = promisify( this.connect.comment ).bind( this.connect );

    return broadcastFn( ...args ).then( () => {
      const author = args[2];
      const permlink = args[3];

      return this.getTopic( author, permlink );
    } );
  }


}

export default new SteemService();
