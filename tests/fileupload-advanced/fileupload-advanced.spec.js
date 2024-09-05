import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('FileuploadAdvanced tests', () => {
  test.describe('FileuploadAdvanced example tests', () => {
    const url = '/components/fileupload-advanced/example-index.html';

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
          const elem = document.querySelector('.fileupload-advanced');
          return elem?.outerHTML;
        });
        await expect(html).toMatchSnapshot('fileupload-advanced-html');
      });

      test('should match the visual snapshot in percy', async ({ page, browserName }) => {
        if (browserName !== 'chromium') return;
        await percySnapshot(page, 'fileupload-advanced-light');
      });
    });

    test.describe('functionality tests', () => {
    });
  });

  test.describe('fileuploadadvanced tests', () => {
    const url = '/components/fileupload-advanced/example-index.html';

    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test.describe('open fileupload tests', () => {
      test('value should have a file', async ({ page }) => {
        const input = page.locator('.hyperlink');

        await expect(input).toBeVisible();

        await input.setInputFiles('./app/www/images/35.jpg');

        await expect(page.locator('.drop-area + .container')).toBeVisible();
        await expect(page.locator('.drop-area + .container')).toHaveClass('container');
      });
    });
  });
});
