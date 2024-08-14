import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Tabs module tests', () => {
  const url = '/components/tabs-module/example-index.html';
  const colors = ['default', 'BB5500', '7928E1', '0066D4', '1F9254', '535353', '8D0B0E', '6F6F76', '297B7B'];

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Enterprise');
    });
  });

  colors.forEach((color) => {
    test.describe('color tests', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`${url}?colors=${color}`);
        await page.locator('.tab-list-container').waitFor();
      });

      test(`should pass an Axe scan for ${color}`, async ({ page, browserName }) => {
        if (browserName !== 'chromium') return;
        const accessibilityScanResults = await new AxeBuilder({ page })
          .disableRules(['meta-viewport', 'aria-required-parent', 'nested-interactive'])
          .exclude('[disabled]')
          .include('.tab-list-container')
          .analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });
  });
});
