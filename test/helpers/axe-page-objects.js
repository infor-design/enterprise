const AxeBuilder = require('axe-webdriverjs');
const rules = require('./default-axe-options.js');

const AxePageObject = async function (theme) {
  let res;
  if (theme === 'high-contrast') {
    res = await AxeBuilder(browser.driver).exclude('header').analyze();
  }

  res = await AxeBuilder(browser.driver).configure({ rules }).exclude('header').analyze();

  return res;
};

module.exports = AxePageObject;
