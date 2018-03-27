process.on('unhandledRejection', (err) => {
  // Handle errors in a concise manner
  console.warn('unhandledRejection', err)
});
