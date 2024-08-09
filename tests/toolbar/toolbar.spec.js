import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Index tests', () => {
  const url = 'localhost:4000/components/toolbar/example-index.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Enterprise');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
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
      await percySnapshot(page, 'toolbar-light');
    });
  });

  test.describe('functionality tests', () => {
  });
});

// test.describe('Toolbar tests', () => {
//   test.describe('Index tests', () => {
//     const url = 'localhost:4000/components/toolbar/example-index.html';

//     test.beforeEach(async ({ page }) => {
//       await page.goto(url);
//     });

//     test.describe('general page checks', () => {
//       test('should have a title', async ({ page }) => {
//         await expect(page).toHaveTitle('IDS Enterprise');
//       });

//       test('should not have errors', async ({ page, browserName }) => {
//         if (browserName === 'firefox') return;
//         let exceptions = null;
//         await page.on('pageerror', (error) => {
//           exceptions = error;
//         });

//         await page.goto(url);
//         await page.waitForLoadState();
//         await expect(exceptions).toBeNull();
//       });
//     });

//     test.describe('accessibility tests', () => {
//       test('should pass an Axe scan', async ({ page, browserName }) => {
//         if (browserName !== 'chromium') return;
//         const accessibilityScanResults = await new AxeBuilder({ page })
//           .disableRules(['meta-viewport'])
//           .exclude('[disabled]')
//           .analyze();
//         expect(accessibilityScanResults.violations).toEqual([]);
//       });
//     });

//     test.describe('snapshot tests', () => {
//       test('should match the visual snapshot in percy', async ({ page, browserName }) => {
//         if (browserName !== 'chromium') return;
//         await percySnapshot(page, 'toolbar-light');
//       });
//     });

//     test.describe('functionality tests', () => {
//     });
//   });

//   test.describe('Destroy and remove tests', () => {
//     const url = 'localhost:4000/components/toolbar/test-destroy-and-remove.html';

//     test.beforeEach(async ({ page }) => {
//       await page.goto(url);
//     });

//     test.describe('general page checks', () => {
//       test('should have a title', async ({ page }) => {
//         await expect(page).toHaveTitle('IDS Enterprise');
//       });

//       test('should not have errors', async ({ page, browserName }) => {
//         if (browserName === 'firefox') return;
//         let exceptions = null;
//         await page.on('pageerror', (error) => {
//           exceptions = error;
//         });

//         await page.goto(url);
//         await page.waitForLoadState();
//         await expect(exceptions).toBeNull();
//       });
//     });

//     test.describe('e2e tests', () => {
//       test('should destroy and remove the toolbar', async ({ page }) => {
//         const toolbar = page.locator('.toolbar');
//         const buttonset = page.locator('.buttonset');
//         const closeButton = page.locator('.buttonset > button').first();

//         // Click the button to destroy the toolbar
//         closeButton.click();

//         // Assert that the 'do-resize' class is removed from the toolbar via the destroy method.
//         await expect(toolbar).not.toHaveClass(/do-resize/);
//         // expect to remove the buttonset due to empty method.
//         await expect(buttonset).not.toBeVisible();
//       });
//     });
//   });
// });
