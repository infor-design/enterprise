import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('ModuleNav tests', () => {
  const url = '/components/module-nav/example-index.html';

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
        .disableRules(['meta-viewport', 'landmark-one-main', 'region', 'skip-link'])
        .exclude('[disabled]')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const html = await page.evaluate(() => {
        const elem = document.querySelector('.module-nav');
        return elem?.outerHTML;
      });
      await expect(html).toMatchSnapshot('module-nav-html');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.waitForSelector('#module-nav-settings-btn');
      await percySnapshot(page, 'module-nav-light');
    });
  });

  test.describe('functionality tests', () => {
  });
});
