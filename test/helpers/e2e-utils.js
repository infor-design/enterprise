module.exports = {
  isIE: () => browser.browserName === 'ie',
  isFF: () => browser.browserName === 'firefox',
  isSafari: () => browser.browserName === 'safari',
  isChrome: () => browser.browserName === 'chrome',
  isMac: async () => {
    const capabilities = await browser.getCapabilities();
    return capabilities.platform === 'MAC';
  },
  isBS: () => process.env.isBrowserStack,
  isCI: () => process.env.TRAVIS,
  setPage: async (url) => {
    let addQuery = '?';
    let theme = `theme=${browser.params.theme}`;
    if (url.indexOf('?') > -1) {
      addQuery = '';
      theme = `&${theme}`;
    }

    const pageurl = `${browser.baseUrl + url}${addQuery}${theme}`;
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(pageurl);
  },
  checkForErrors: async () => {
    await browser.manage().logs().get('browser').then((browserLog) => {
      let errors = 0;
      for (let i = 0; i < browserLog.length; i++) {
        const type = browserLog[i].level.name;
        console.log(type, browserLog[i].message); //eslint-disable-line
        errors++;
      }
      expect(errors).toEqual(0);
    });
  },
  getSelectedText: async () => {
    await browser.executeScript(() => {
      let text = '';
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type !== 'Control') {
        text = document.selection.createRange().text;
      }
      return text;
    });
  }
};
