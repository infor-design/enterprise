import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Notification tests', () => {
  const url = '/components/notification/example-index.html';

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
        .disableRules(['meta-viewport', 'color-contrast'])
        .exclude('[disabled]')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'notification-light');
    });
  });

  test.describe('functionality tests', () => {
  });
});

test.describe('Notification widget tests', () => {
  const url = '/components/notification/example-widget.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('e2e tests', () => {
    test('should display toast on notification close', async ({ page }) => {
      // Selectors for different types of notifications
      const notifications = ['.error .notification-close', '.alert .notification-close', '.success .notification-close', '.info .notification-close'];

      for (const notification of notifications) {
        await page.click(notification);
        const isVisible = await page.isVisible('#toast-container');
        expect(isVisible).toBe(true); // Check if toast container is visible
      }
    });
  });
});
