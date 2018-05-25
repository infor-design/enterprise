module.exports = {
  isIE: () => browser.browserName === 'ie',
  isFF: () => browser.browserName === 'firefox',
  isSafari: () => browser.browserName === 'safari',
  isChrome: () => browser.browserName === 'chrome',
  setPage: async (url) => {
    const pageurl = `${browser.baseUrl + url}?theme=${browser.params.theme}`;
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(pageurl);
  }
};
