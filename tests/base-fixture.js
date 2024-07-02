/* eslint-disable no-underscore-dangle */
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  test as baseTest
} from '@playwright/test';
import { CustomEventTest } from './helper-fixture';

const istanbulCLIOutput = path.join(process.cwd(), '.nyc_output');

/**
 * Generate a Unique ID
 * @returns {string} the unique ID
 */
export function generateUUID() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Extends the test command in playwright
 */
export const test = baseTest.extend({
  context: async ({ context }, use) => {
    // eslint-disable-next-line no-undef
    await context.addInitScript(() => window.addEventListener('beforeunload', () => (window).collectIstanbulCoverage(JSON.stringify(window.__coverage__))),);
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });
    await context.exposeFunction('collectIstanbulCoverage', (coverageJSON) => {
      if (coverageJSON) { fs.writeFileSync(path.join(istanbulCLIOutput, `playwright_coverage_${generateUUID()}.json`), coverageJSON); }
    });
    await use(context);
    // eslint-disable-next-line no-restricted-syntax
    for (const page of context.pages()) {
      // eslint-disable-next-line no-undef
      await page.evaluate(() => window.collectIstanbulCoverage(JSON.stringify(window.__coverage__)));
    }
  },
  eventsTest: async ({ page }, use) => {
    const eventTest = await (new CustomEventTest(page)).initialize();
    await use(eventTest);
  }
});

/**
 * Adds a command to mount a blank page
 * @param {any} page the page element
 * @param {string} html the html element
 * @returns {unknown} the element that was inserted
 */
export async function mount(page, html) {
  await page.goto('/ids-demo-app/blank.html');
  await page.evaluate((pageHtml) => {
    // eslint-disable-next-line no-undef
    const body = document.querySelector('body');
    if (body) {
      body.innerHTML = pageHtml;
    }
  }, html);

  const tagHandle = await page.locator('body:first-child');
  return tagHandle;
}

/**
 * Runs a util that is added to the page in ids-demo-app/utils.ts
 * @param {any} page the page element
 * @param {string} utilName the util name
 * @param {any} value the first param
 * @param {any} value2 the second param
 * @param {any} value3 the third param
 * @returns {unknown} the element that was inserted
 */
export async function runFunction(page, utilName, value, value2, value3) {
  if (value3) {
    // eslint-disable-next-line max-len, no-undef
    const returnValue = await page.evaluate(obj => ((window).utils)[obj.utilName](obj.value, obj.value2, obj.value3), {
      utilName, value, value2, value3
    });
    return returnValue;
  }

  if (value2) {
    // eslint-disable-next-line max-len, no-undef
    const returnValue = await page.evaluate(obj => ((window).utils)[obj.utilName](obj.value, obj.value2), { utilName, value, value2 });
    return returnValue;
  }

  // eslint-disable-next-line max-len, no-undef
  const returnValue = await page.evaluate(obj => ((window).utils)[obj.utilName](obj.value), { utilName, value });
  return returnValue;
}
