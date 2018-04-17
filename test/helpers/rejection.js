process.on('unhandledRejection', (err) => {
  /* eslint-disable no-console */
  console.warn('unhandledRejection', err);
});
