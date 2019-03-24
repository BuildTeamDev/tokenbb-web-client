import {
  getValidTopic,
  listValidTopics,
  publishReply,
  publishTopic,
} from './api.service.js';


export async function listTopics( category ) {
  const topics = await listValidTopics( category );
  return topics.data.map( postToTopic );
}

export function postToTopic( post ) {
  return {
    id: post.id,
    pinned: post.pinned,
    hidden: post.hidden,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    categoryId: post.category,
    author: post.author,
    permlink: post.steem.permlink,
    title: post.title,
    body: post.body,
    steem: post.steem,
    replies: post.replies,
    numberOfReplies: post.meta.replies,
    numberOfViews: post.meta.views,
    lastReply: post.meta.last_reply,
  };
}

export async function getTopic( author, permlink ) {

  // throw Error('Implement this with api call to db and redirect')
  const topic = await getValidTopic( author, permlink );
  if ( topic === null ) {
    return null;
  }
  return postToTopic( topic.data );
}
export function createTopic( author, category, title, content ) {
  return publishTopic( category, author, title, content );
}

export function createReply( parentComment, author, content ) {
  const message = {
    author,
    content,
  };

  return publishReply( parentComment, message ).then( ( result ) => result.data );
}

