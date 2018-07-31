module.exports = {
  isIE: () => browser.browserName === 'ie',
  isFF: () => browser.browserName === 'firefox',
  isSafari: () => browser.browserName === 'safari',
  isChrome: () => browser.browserName === 'chrome',
  isMac: async () => {
    const capabilities = await browser.getCapabilities();
    return capabilities.platform === 'MAC';
  },
  isCI: () => process.env.TRAVIS,
  setPage: async (url) => {
    const pageurl = `${browser.baseUrl + url}?theme=${browser.params.theme}`;
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(pageurl);
  },
  checkForErrors: async () => {
    await browser.manage().logs().get('browser').then((browserLog) => {
      for (let i = 0; i < browserLog.length; i++) {
        console.log(browserLog[i].level.name, browserLog[i].index); //eslint-disable-line
      }
      expect(browserLog.length).toEqual(0);
    });
  }
};
