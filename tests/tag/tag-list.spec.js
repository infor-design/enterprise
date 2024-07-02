import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Tag List tests', () => {
  const url = '/components/tag/example-index.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Enterprise');
    });
  });

  test.describe('general tests', () => {
    test('should be get tag list length', async ({ page }) => {
      const value = await page.evaluate(() => $('.tag-list:first-child').data('taglist').length);
      await expect(value).toBe(9);
    });
  });
});
