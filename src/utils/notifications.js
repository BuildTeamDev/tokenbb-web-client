export const errorAlertOptions = ( message, err ) => {
  const fullMessage = `${message}: ${err.message}`;
  return {
    message: fullMessage,
    type: 'is-danger',
    duration: 5000,
  };
};
