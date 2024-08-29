import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Autocomplete tests', () => {
  const url = '/components/autocomplete/example-index.html';

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
        .disableRules(['meta-viewport', 'aria-required-attr'])
        .exclude('[disabled]')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const html = await page.evaluate(() => {
        const elem = document.querySelector('.autocomplete');
        return elem?.outerHTML;
      });
      await expect(html).toMatchSnapshot('autocomplete-html');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'autocomplete-light');
    });
  });

  test.describe('functionality tests', () => {
  });

  test.describe('Autocomplete long list tests', () => {
    const url = '/components/autocomplete/example-contains.html';

    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test.describe('use key down to scroll test', () => {
      test('should scroll down properly', async ({ page }) => {
        const val = 'a';
        const input = page.locator('#autocomplete-default');

        await input.click();
        await input.fill(val);
        await expect(page.locator('#autocomplete-list')).toBeVisible();
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');

        await expect(page.locator('#ac-list-option42')).toBeVisible();
        await expect(page.locator('#ac-list-option42')).toHaveClass('is-selected');
      });
    });
  });
});
