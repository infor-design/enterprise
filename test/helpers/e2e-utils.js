module.exports = {
  isIE: () => browser.browserName === 'ie',
  isFF: () => browser.browserName === 'firefox',
  isSafari: () => browser.browserName === 'safari',
  isChrome: () => browser.browserName === 'chrome',
  isMac: async () => {
    const capabilities = await browser.getCapabilities();
    return capabilities.platform === 'MAC';
  },
  setPage: async (url) => {
    const pageurl = `${browser.baseUrl + url}?theme=${browser.params.theme}`;
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(pageurl);
  }
};
