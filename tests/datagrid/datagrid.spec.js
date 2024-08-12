import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Datagrid tests', () => {
  test.describe('Index page tests', () => {
    const url = '/components/datagrid/example-index.html';

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
        await percySnapshot(page, 'datagrid-light');
      });
    });

    test.describe('functionality tests', () => {
      test('should be able to disable selection with readonly checkboxes', async ({ page }) => {
        await page.goto('/components/datagrid/example-disabled-selection-checkbox.html');
        await page.locator('.datagrid tr:first-child td:first-child').click();
        expect(await page.locator('.selection-count')).toHaveText('0 Selected');
        await page.locator('.datagrid tr:first-child td:nth-child(6)').click();
        expect(await page.locator('.selection-count')).toHaveText('0 Selected');
      });
    });
  });

  test.describe('Expandable row page tests', () => {
    const url = '/components/datagrid/example-expandable-row.html';

    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test.describe('snapshot tests', () => {
      test('should match the visual snapshot in percy', async ({ page, browserName }) => {
        if (browserName !== 'chromium') return;

        // Function to handle the actions and snapshot for specific row option
        const captureSnapshot = async (option, snapshotName) => {
          await page.locator('#custom-id-actions').click();
          await page.locator(`a[data-option="row-${option}"]`).click();

          // Capture a Percy snapshot with the specified name
          await percySnapshot(page, snapshotName);
        };

        // Capture snapshot for "extra-small" row height
        await captureSnapshot('extra-small', 'datagrid-expandable-row-extra-small-padding');

        // Capture snapshot for "small" row height
        await captureSnapshot('small', 'datagrid-expandable-row-small-padding');

        // Capture snapshot for "medium" row height
        await captureSnapshot('medium', 'datagrid-expandable-row-medium-padding');
      });
    });
  });
});
