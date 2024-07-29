import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Icons tests', () => {
  const url = '/components/icons/example-index.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Enterprise');
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const html = await page.evaluate(() => {
        const elem = document.querySelector('.icon');
        return elem?.outerHTML;
      });
      await expect(html).toMatchSnapshot('icons-html');
    });
  });

  test.describe('functionality tests', () => {
  });
});
