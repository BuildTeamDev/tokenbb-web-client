import { DateTime } from 'luxon';

export function quoteText( quote ) {
  const user = quote.author.user;
  const textToQuote = quote.body;
  const timeOfQuote = DateTime.fromISO( quote.updatedAt, { zone: 'utc' } )
    .toFormat( 'dd.LL.yyyy HH:mm:ss' ) + ' UTC';
  return `\n> User @${ user } wrote at ${ timeOfQuote }:\n> \n${ textToQuote.replace( /^/gm, '> ' ) }\n> \n`;
}

export function formatDate( dateValue ) {
  if ( !dateValue ) {
    return 'invalid datetime!';
  }
  return DateTime.fromISO( String( dateValue ) )
    .toFormat( 'dd.LL.yyyy' );
}

export function formatDateTimeRelative( dateValue ) {
  if ( !dateValue ) {
    return 'invalid datetime!';
  }
  const time = DateTime.fromISO( String( dateValue ) );
  return time .toRelative();
}

export function formatDateTimeAbsolute( dateValue ) {
  if ( !dateValue ) {
    return 'invalid datetime!';
  }
  const time = DateTime.fromISO( String( dateValue ) );
  return time.toFormat( 'dd.LL.yyyy HH:mm:ss' );
}

export function formatDateTimeFromNow( dateValue ) {
  if ( !dateValue ) {
    return 'invalid datetime!';
  }
  const time = DateTime.fromISO( String( dateValue ) );
  const daysDiff = time.diff( DateTime.local().startOf( 'day' ), 'days' ).as( 'days' );
  if ( daysDiff < -2 ) {
    return time.toFormat( 'dd.LL.yyyy HH:mm:ss' );
  }
  return time .toRelative();
}
