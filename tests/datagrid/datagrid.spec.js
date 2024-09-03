import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

const datagridUrl = '/components/datagrid/';

test.describe('Datagrid tests', () => {
  test.describe('Index page tests', () => {
    const url = `${datagridUrl}example-index.html`;

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
        await page.goto(`${datagridUrl}example-disabled-selection-checkbox.html`);
        await page.locator('.datagrid tr:first-child td:first-child').click();
        expect(await page.locator('.selection-count')).toHaveText('0 Selected');
        await page.locator('.datagrid tr:first-child td:nth-child(6)').click();
        expect(await page.locator('.selection-count')).toHaveText('0 Selected');
      });
    });
  });

  test.describe('Expandable row page tests', () => {
    const url = `${datagridUrl}example-expandable-row.html`;

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

        // Capture snapshot for "large" / "Normal" row height
        await captureSnapshot('large', 'datagrid-expandable-row-large-padding');
      });
    });
  });

  test.describe('Inline editor page tests', () => {
    const url = `${datagridUrl}test-editable-with-inline-editor.html`;

    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test.describe('edit cell tests', () => {
      test('value should stay the same', async ({ page }) => {
        const val = '&<>';
        const input = page.locator('#datagrid-inline-input-2-2');

        await input.click();
        await input.fill(val);
        await page.locator('body').click({ position: { x: 0, y: 0 } });
        await input.click();

        await expect(input).toHaveValue(val);
      });
    });
  });

  test.describe('Filter header page tests', () => {
    const url = `${datagridUrl}example-filter.html`;

    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test.describe('filter header tests', () => {
      test('filter value should stay on changing row height', async ({ page }) => {
        const val = '1';
        const input = page.locator('#custom-id-filter-id');
        const moreBtn = page.locator('#custom-id-actions');

        await input.click();
        await input.fill(val);
        await page.keyboard.press('Enter');
        await moreBtn.click();

        const li = page.locator('ul.is-open > li.is-selectable:not(.is-checked)');

        await li.nth(0).click();

        await expect(input).toHaveValue(val);
      });
    });
  });

  test.describe('datagrid toolbar button tests', () => {
    const url = `${datagridUrl}example-mixed-selection.html`;

    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test.describe('button hover tests', () => {
      test('value should have a proper color', async ({ page }) => {
        await page.evaluate('document.getElementsByClassName("datagrid-selection-checkbox")[0].click()');

        await expect(page.locator('.contextual-toolbar > .buttonset > .btn')).toBeVisible();

        const button = page.locator('.contextual-toolbar > .buttonset > .btn');
        await button.hover();

        // eslint-disable-next-line arrow-body-style
        const color = await button.evaluate((el) => {
          return window.getComputedStyle(el).getPropertyValue('background-color');
        });

        await expect(color).toBe('rgba(0, 0, 0, 0.3)');
      });
    });
  });
});
