import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Applicationmenu tests', () => {
  const url = '/components/applicationmenu/example-index.html';

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
        .disableRules(['meta-viewport', 'landmark-banner-is-top-level'])
        .exclude('[disabled]')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const html = await page.evaluate(() => {
        const elem = document.querySelector('#application-menu');
        return elem?.outerHTML;
      });
      await expect(html).toMatchSnapshot('application-menu-html');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;

      // Take the initial snapshot before the menu is opened
      await percySnapshot(page, 'application-menu-light');

      // Find and click the app menu button
      const appMenuButton = await page.locator('#header-hamburger');
      await appMenuButton.click();

      // Wait for the 'transitionend' event to ensure the menu transition has finished
      await page.evaluate(() => new Promise((resolve) => {
        const element = document.querySelector('#application-menu');
        element.addEventListener('transitionend', resolve, { once: true });
      }));

      // Take the snapshot after the transition is complete
      await percySnapshot(page, 'application-menu-open-light');
    });
  });

  test.describe('functionality tests', () => {
  });
});
