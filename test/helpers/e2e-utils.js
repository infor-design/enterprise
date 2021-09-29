const chalk = require('chalk');
const logger = require('../../scripts/logger');
const config = require('./e2e-config.js');

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
  isCI: () => process.env.CI,
  setPage: async (url) => {
    const pageurl = `${browser.baseUrl + url}`;
    await browser.waitForAngularEnabled(false);
    await browser.driver.get(pageurl);
  },
  checkForErrors: async () => {
    try {
      await browser.manage().logs().get('browser').then((browserLog) => {
        let errors = 0;
        for (let i = 0; i < browserLog.length; i++) {
          logger('error', browserLog[i].message);
          errors++;
        }
        expect(errors).toEqual(0);
      });
    } catch (e) {
      // Do nothing
    }
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
  },
  reportAxeViolations: (res) => {
    let msg = '';
    if (!res || !res.violations || !res.violations.length) {
      return;
    }

    msg += 'Axe Violations:\n\n';
    res.violations.forEach((violation) => {
      msg += `${chalk.bold(violation.help)}\n`;

      const violationNodes = violation.nodes || [];
      let failureSummary;
      let targetList = '';
      violationNodes.forEach((node) => {
        if (!failureSummary) {
          failureSummary = node.failureSummary;
        }
        node.target.forEach((target) => {
          targetList += `  \`${target}\`\n`;
        });
      });

      msg += `${chalk.yellow('Targets:')}\n`;
      msg += `${targetList}\n`;
      msg += `${chalk.yellow('Suggested Fix:')} ${failureSummary}\n`;
    });

    logger('error', msg);
  },
  rgb2hex: (str) => {
    const newStr = str.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (newStr && newStr.length === 4) ? `#${(`0${parseInt(newStr[1], 10).toString(16)}`).slice(-2)}${(`0${parseInt(newStr[2], 10).toString(16)}`).slice(-2)}${(`0${parseInt(newStr[3], 10).toString(16)}`).slice(-2)}` : '';
  },
  waitsFor: async (condition, el) => {
    if (condition && el && protractor && browser && browser.driver) {
      const expected = protractor.ExpectedConditions;
      await browser.driver.wait(expected[condition](el), config.waitsFor);
    }
  },
  getWidthandCompare: async (el, width) => {
    const elem = await page.$eval(el, e => getComputedStyle(e).width);
    expect(elem).toBe(width);
  },
  getCssPropsandCompare: async (el, style, value) => {
    let isFailed = false;
    try {
      const elem = await page.$eval(el, e => JSON.parse(JSON.stringify(getComputedStyle(e))));
      const { [style]: props } = elem;
      expect(elem[props]).toBe(value);
    } catch (error) {
      isFailed = true;
    }
    return isFailed;
  },
  checkDataAutomationID: async (el, val) => {
    let isFailed = false;
    try {
      const elemHandle = await page.$(el);
      const elemID = await page.evaluate(elem => elem.getAttribute('data-automation-id'), elemHandle);
      expect(elemID).toEqual(val);
    } catch (error) {
      isFailed = true;
    }
    return isFailed;
  },
  compareInnerHTML: async (el, value) => {
    let isFailed = false;
    try {
      const elem = await page.$eval(el, element => element.innerHTML);
      expect(elem).toContain(value);
    } catch (error) {
      isFailed = true;
    }
    return isFailed;
  },
  checkTooltip: async (parentEL, tooltipEL, elHandle, expectedValue) => {
    let isFailed = false;
    try {
      await page.waitForSelector(parentEL);
      await page.hover(parentEL);
      await page.waitForSelector(tooltipEL, { visible: true });
      const tooltipHandle = await page.$(elHandle);
      const tooltipValue = await page.evaluate(el => el.innerText, tooltipHandle);
      expect(tooltipValue).toEqual(expectedValue);
    } catch (error) {
      isFailed = true;
    }
    return isFailed;
  },
  isExist: async (element) => {
    let isFailed = false;
    try {
      const elem = await page.$eval(element, el => el !== null);
      expect(elem).toBe(true);
    } catch (error) {
      isFailed = true;
    }
    return isFailed;
  },
  checkClassName: async (el, val) => {
    let isFailed = false;
    try {
      const elemHandle = await page.$(el);
      const elemID = await page.evaluate(elem => elem.getAttribute('class'), elemHandle);
      expect(elemID).toEqual(val);
    } catch (error) {
      isFailed = true;
    }
    return isFailed;
  }
};
