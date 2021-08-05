module.exports = {
  server: {
    command: 'export PORT=1000 && node app/server.js',
    launchTimeout: 50000
  },
  // https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#puppeteerlaunchoptions
  launch: {
    headless: true,
    devtools: false,
    ignoreHTTPSErrors: true,
    dumpio: false
  }
};
