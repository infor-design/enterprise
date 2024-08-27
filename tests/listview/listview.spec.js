import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Listview tests', () => {
  test.describe('Index tests', () => {
    const url = '/components/listview/example-index.html';

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
      test('should match innerHTML snapshot', async ({ page, browserName }) => {
        if (browserName !== 'chromium') return;
        const html = await page.evaluate(() => {
          const elem = document.querySelector('.listview');
          return elem?.outerHTML;
        });
        await expect(html).toMatchSnapshot('listview-html');
      });

      test('should match the visual snapshot in percy', async ({ page, browserName }) => {
        if (browserName !== 'chromium') return;
        await percySnapshot(page, 'listview-light');
      });
    });

    test.describe('functionality tests', () => {
    });
  });

  test.describe('Form compact tests', () => {
    const url = 'components/listview/example-form-compact.html';

    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test.describe('snapshot tests', () => {
      test('should match the visual snapshot in percy', async ({ page, browserName }) => {
        if (browserName !== 'chromium') return;
        await percySnapshot(page, 'listview-form-compact-light');
      });
    });
  });
});
