import { DateTime } from 'luxon';
import { replace } from 'lodash';

export const quoteText = ( quote ) => {
  const user = quote.author.user;
  const textToQuote = quote.body;
  const timeOfQuote = DateTime.fromISO( quote.updatedAt, { zone: 'utc' } ).toFormat( 'dd.LL.yyyy HH:mm:ss' ) + ' UTC';
  return `\n> User @${user} wrote at ${timeOfQuote}:\n> \n${replace( textToQuote, /^/gm, '> ' )}\n> \n`;
};

export const formatDate = ( dateValue ) => {
  if ( !dateValue ) {
    return 'invalid datetime!';
  }
  return DateTime.fromISO( String( dateValue ) ).toFormat( 'dd.LL.yyyy' );
};

export const formatDateTimeRelative = ( dateValue ) => {
  if ( !dateValue ) {
    return 'invalid datetime!';
  }
  const time = DateTime.fromISO( String( dateValue ) );
  return time.toRelative();
};

export const formatDateTimeAbsolute = ( dateValue ) => {
  if ( !dateValue ) {
    return 'invalid datetime!';
  }
  const time = DateTime.fromISO( String( dateValue ) );
  return time.toFormat( 'dd.LL.yyyy HH:mm:ss' );
};

export const formatDateTimeFromNow = ( dateValue ) => {
  if ( !dateValue ) {
    return 'invalid datetime!';
  }
  const time = DateTime.fromISO( String( dateValue ) );
  const daysDiff = time.diff( DateTime.local().startOf( 'day' ), 'days' ).as( 'days' );
  if ( daysDiff < -2 ) {
    return time.toFormat( 'dd.LL.yyyy HH:mm:ss' );
  }
  return time.toRelative();
};
