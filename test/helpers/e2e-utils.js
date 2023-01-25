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
  /**
   * Configuration for jest image snapshot
   * See https://github.com/americanexpress/jest-image-snapshot#%EF%B8%8F-api for the API needed.
   * @param {string} customSnapshotIdentifier A custom name to give this snapshot.
   * @returns {object} takes an optional options object.
   */
  // eslint-disable-next-line arrow-body-style
  getConfig: (customSnapshotIdentifier) => {
    return {
      // anything less than 0.5 percent difference passes as the same
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
      customSnapshotIdentifier,
      customSnapshotsDir: './test/baseline-images',
      customDiffDir: './test/baseline-images/diff',
      // Reduced false positives (failing tests when the images look the same)
      comparisonMethod: 'ssim'
    };
  },

  /**
   * Checks the computed style of a particular element with strict equality.
   * @param {string} selector - The selector for the element.
   * @param {string} style - The css property to look for.
   * @param {string} value - The value to compare. Expected Value.
   * @returns {void}
   */
  checkElementCssProperty: async (selector, style, value) => {
    const computedValue = await page.evaluate(
      (sel, sty) => getComputedStyle(document.querySelector(sel)).getPropertyValue(sty),
      selector, 
      style
    );

    expect(computedValue).toBe(value);
  },

  /**
   * Checks if data automation id matches the given value.
   * @param {string} selector - The selector for the element to get the property value for.
   * @param {string} value - The value to compare. Expected Value.
   * @returns {void}
   */
  checkDataAutomationId: async (selector, value) => {
    const elemHandle = await page.evaluateHandle(sel => document.querySelector(sel), selector);
    const elemId = await page.evaluate(elem => elem.getAttribute('data-automation-id'), elemHandle);
    expect(elemId).toEqual(value);
  },

  /**
   * Checks if Inner HTML contains the given value.
   * @param {string} selector - The selector for the element.
   * @param {string} value - The value to compare. Expected Value.
   */
  checkInnerHTMLValue: async (selector, value) => {
    let isFailed = false;
    try {
      const elem = await page.$eval(selector, element => element.innerHTML);
      expect(elem).toContain(value);
    } catch (error) {
      isFailed = true;
    }
    return isFailed;
  },

  /**
     * Checks if tooltip of the element matches the given value.
     * param {string} parentEL - The selector for the element you want to see the tooltip.
     * param {string} tooltipEL - The selector for the tooltip element.
     * param {string} elHandle - The selector for the tooltip content.
     * param {string} expectedValue - The tooltip value to compare.
     * returns {boolean} isFailed - return true if the comparison is failed, return false otherwise.
     */
  checkTooltipValue: async (parentEL, tooltipEL, elHandle, expectedValue) => {
    let isFailed = false;
    try {
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

  /**
   * Checks if the element exists on the page.
   * @param {string} selector - The selector for the element to get the property value for
   * @returns {boolean} check if element exists on the page
   */
  checkIfElementExists: async (page, selector) => (await page.$(selector)) !== null,

  /**
   * Checks if the element has focused.
   * @param {string} selector - The element selector.
   * @returns {boolean} - return true if element is focused
   */
  checkIfElementHasFocused: async selector => page.evaluate(
    sel => document.querySelector(sel) === document.activeElement,
    selector
  ),

  /**
     * Checks if the Class Name of an element contains the given value.
     * param {string} selector - The selector for the element.
     * param {string} value - The value to compare. Expected Value.
     * returns {boolean} isFailed - return true if the comparison is failed, return false otherwise.
     */
  checkClassNameValue: async (selector, value) => {
    let isFailed = false;
    try {
      const elemHandle = await page.$(selector);
      const elemID = await page.evaluate(elem => elem.getAttribute('class'), elemHandle);
      expect(elemID).toEqual(value);
    } catch (error) {
      isFailed = true;
    }
    return isFailed;
  },

  /**
   * Drag and Drop element to a specific location.
   * @param {string|object} originSelector - The selector for the origin element.
   * @param {string|object} destinationSelector - The selector of the destination element.
   */
  dragAndDrop: async (originSelector, destinationSelector) => {
    await page.waitForSelector(originSelector);
    const origin = await page.$(originSelector);
    const ob = await origin.boundingBox();
    await page.mouse.move(ob.x + ob.width / 2, ob.y + ob.height / 2);
    await page.mouse.down();

    if (typeof destinationSelector === 'string') {
        await page.waitForSelector(destinationSelector);
        const destination = await page.$(destinationSelector);
        const db = await destination.boundingBox();
        await page.mouse.move(db.x + db.width / 2, db.y + db.height / 2);
    } else if (Array.isArray(destinationSelector)) {
        const { x, y } = destinationSelector[0];
        await page.mouse.move(parseFloat(x), parseFloat(y));
    } else {
        const destination = destinationSelector;
        const db = await destination.boundingBox();
        await page.mouse.move(db.x + db.width / 2, db.y + db.height / 2);
    }
    await page.mouse.up();
  },
};
