import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('About tests', () => {
  const url = '/components/about/example-index.html';

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
      await page.locator('#about-trigger').click();
      await page.waitForSelector('.about');
      const html = await page.evaluate(() => {
        const elem = document.querySelector('.about');
        return elem?.outerHTML;
      });
      await expect(html).toMatchSnapshot('about-html');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'about-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should show the about dialog', async ({ page }) => {
      await page.locator('#about-trigger').click();
      const element = await page.waitForSelector('#about-modal');
      expect(element).toBeTruthy();
    });

    test('should display the version', async ({ page }) => {
      await page.locator('#about-trigger').click();
      const element = await page.waitForSelector('#about-modal .modal-body .version');
      expect(await element.textContent()).toContain('IDS version: 4.');
    });

    test('should be able to set id/automation id', async ({ page }) => {
      await page.locator('#about-trigger').click();
      await page.waitForSelector('#about-modal', { state: 'visible' });

      expect(await page.locator('#about-modal').count()).toEqual(1);
      expect(await page.locator('#about-modal-btn-close').count()).toEqual(1);
    });
  });

  test.describe('Translation tests', () => {
    test.beforeEach(async ({ page }) => {
      const url = '/components/about/example-index?locale=uk-UA';
      await page.goto(url);
    });

    test('should show the about dialog in ukranian', async ({ page}) => {
      await page.locator('#about-trigger').click();
      await page.waitForSelector('.modal-body', { state: 'visible' });
      const ukText = `Авторські права © Infor, ${new Date().getFullYear()}. Усі права збережено. Усі зазначені у цьому документі назви та дизайн елементів є товарними знаками або захищеними товарними знаками Infor та/або афілійованих організацій і філіалів Infor. Усі інші товарні знаки, перелічені тут, є власністю відповідних власників. www.infor.com.`;
      expect(await page.locator('.additional-content + p').textContent()).toEqual(ukText);
    });

    test('should show version correctly in arabic', async ({ page }) => {
      await page.goto('/components/about/example-index?locale=ar-SA')
      await page.locator('#about-trigger').click();
      await page.waitForSelector('.modal-body', { state: 'visible' });

      // Arabic text is not inverted here but is correct
      expect(await page.locator('.version').textContent()).toContain('إصدار');
    });
  });
});
