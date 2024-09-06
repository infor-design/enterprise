import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Dropdown tests', () => {
  test.describe('Dropdown example tests', () => {
    const url = '/components/dropdown/example-index.html';

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
          const elem = document.querySelector('.dropdown');
          return elem?.outerHTML;
        });
        await expect(html).toMatchSnapshot('dropdown-html');
      });

      test('should match the visual snapshot in percy', async ({ page, browserName }) => {
        if (browserName !== 'chromium') return;
        await percySnapshot(page, 'dropdown-light');
      });
    });

    test.describe('functionality tests', () => {
    });
  });

  test.describe('Dropdown excess space', () => {
    const url = '/components/dropdown/example-clearable?theme=uplift&variant=light&layout=embedded';

    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test.describe('check dropdown-wrapper class', () => {
      test('value should have no excess space', async ({ page }) => {
        const wrapper = page.locator('#clearable + .dropdown-wrapper');

        await expect(wrapper).toBeVisible();
        await expect(wrapper).toHaveClass('dropdown-wrapper');
      });
    });
  });
});
