import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Switch tests', () => {
  const url = '/components/switch/example-index.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Enterprise');
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(['meta-viewport'])
        .exclude('[disabled]')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'switch-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should toggle switch state via click', async ({ page }) => {
      const locator = await page.locator('.switch').first();
      let isChecked;

      // checked by default)
      isChecked = await locator.evaluate(switchElem => switchElem.querySelector('input').checked);
      expect(isChecked).toEqual(true);

      // click to uncheck
      await locator.click({ position: { x: 5, y: 5 } });
      isChecked = await locator.evaluate(switchElem => switchElem.querySelector('input').checked);
      expect(isChecked).toEqual(false);

      // click to check
      await locator.click({ position: { x: 5, y: 5 } });
      isChecked = await locator.evaluate(switchElem => switchElem.querySelector('input').checked);
      expect(isChecked).toEqual(true);
    });
  });
});

test.describe('Switch Compact tests', () => {
  const url = '/components/switch/example-compact.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Enterprise');
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(['meta-viewport'])
        .exclude('[disabled]')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'switch-compact-light');
    });
  });
});
