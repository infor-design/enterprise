import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('Tag tests', () => {
  const url = '/components/tag/example-index.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Enterprise');
    });

    test('should initialize tag content', async ({ page }) => {
      let tagEl;
      let tagAPI;

      const value = await page.evaluate(() => {
        tagEl = document.createElement('span');
        tagEl.classList.add('tag');
        document.body.appendChild(tagEl);
        tagEl.insertAdjacentHTML('afterbegin', '<span class="tag-content">This is a Tag!</span>');
        tagAPI = $(tagEl).tag();
        return tagAPI.find('.tag-content').text();
      });

      expect(value).toEqual('This is a Tag!');
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
        const elem = document.querySelector('.tag');
        return elem?.outerHTML;
      });
      await expect(html).toMatchSnapshot('tag-html');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'tag-light');
    });
  });

  test.describe('setting/attribute tests', () => {
    test('should be able set color by class', async ({ page }) => {
      const locator = await page.locator('.tag').first();
      await page.evaluate(() => {
        const elem = document.querySelector('.tag');
        elem.classList.add('success');
      });
      await expect(await locator).toHaveClass('tag hide-focus success');
      await page.evaluate(() => {
        const elem = document.querySelector('.tag');
        elem.classList.remove('success');
      });
      expect(locator).toHaveClass('tag hide-focus');
    });

    test('should be disabled', async ({ page }) => {
      const locator = await page.locator('.tag').first();
      await page.evaluate(() => {
        const elem = document.querySelector('.tag');
        elem.classList.add('is-disabled');
      });

      await expect(locator).toHaveClass('tag hide-focus is-disabled');
      await page.evaluate(() => {
        const elem = document.querySelector('.tag');
        elem.classList.remove('is-disabled');
      });
      await expect(locator).toHaveClass('tag hide-focus');
    });

    test('can be dismissible', async ({ page }) => {
      const locator = await page.locator('.tag').first();
      await page.evaluate(() => {
        const elem = document.querySelector('.tag');
        elem.classList.add('is-dismissible');
      });

      await expect(locator).toHaveClass('tag hide-focus is-dismissible');
      await page.evaluate(() => {
        const elem = document.querySelector('.tag');
        elem.classList.remove('is-dismissible');
      });
      await expect(locator).toHaveClass('tag hide-focus');
    });

    test('should dismiss on click', async ({ page }) => {
      await page.locator('ids-tag.is-dismissible').first();
      expect(await page.evaluate(() => document.querySelectorAll('.tag').length)).toEqual(15);

      const locator = await page.locator('.tag.is-dismissible:first-child > button').first();
      await locator.click();
      expect(await page.evaluate(() => document.querySelectorAll('.tag').length)).toEqual(14);
    });
  });

  test.describe('event tests', () => {
    test('should fire click event on enter', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const tag = document.querySelector('.tag.is-linkable');
        tag?.addEventListener('click', () => { calls++; });
        tag?.click();
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should veto dismiss in beforetagremove', async ({ page }) => {
      expect(await page.evaluate(() => document.querySelectorAll('.tag.is-dismissible').length)).toEqual(12);
      await page.evaluate(() => {
        const tag = document.querySelector('.tag.is-dismissible');
        tag?.addEventListener('beforetagremove', (e) => { e.detail.response(false); });
        tag.querySelector('button').click();
      });
      expect(await page.evaluate(() => document.querySelectorAll('.tag.is-dismissible').length)).toEqual(11);
    });
  });

  // Problems with the wrapping cause these to not be possible
  // https://github.com/infor-design/enterprise-ng/issues/1716
  test.describe('method tests', () => {
    test('should be able to call dismiss', async ({ page }) => {
      let locator = await page.locator('.tag.is-dismissible').first();
      expect(await locator.innerText()).toContain('Info');

      await page.evaluate(() => document.querySelector('.tag.is-dismissible button').click());

      locator = await page.locator('.tag.is-dismissible').first();
      expect(await locator.innerText()).toContain('Delayed');
    });

    test.skip('should cancel dismiss when not dismissible', async ({ page }) => {
      expect(await page.evaluate(() => document.querySelectorAll('.tag').length)).toEqual(14);

      await page.evaluate(() => document.querySelector('.tag.is-dismissible button').dismiss());

      expect(await page.evaluate(() => document.querySelectorAll('.tag').length)).toEqual(14);
    });

    test.skip('should cancel dismiss when disabled', async ({ page }) => {
      expect(await page.evaluate(() => document.querySelectorAll('.tag').length)).toEqual(14);
      await page.evaluate(() => document.querySelector('.tag.is-disabld button').dismiss());
      expect(await page.evaluate(() => document.querySelectorAll('.tag').length)).toEqual(14);
    });
  });

  test.describe('linkable tag tests', () => {
    test('should display caret right icon correctly', async ({ page }) => {
      await page.goto('/components/tag/example-linkable.html');
      expect(await page.locator('#linkable-tag').count()).toBe(1);
      expect(await page.locator('.tag-list .is-linkable > a + .btn-linkable').count()).toBe(7);
    });
  });

  test.describe('tag content tests', () => {
    test('can be a hyperlink if defined with an anchor', async ({ page }) => {
      const value = await page.evaluate(() => {
        const tagEl = document.createElement('span');
        tagEl.classList.add('tag');
        document.body.appendChild(tagEl);
        tagEl.insertAdjacentHTML('afterbegin', '<a href="#" class="tag-content">This is a Tag!</a>');
        $(tagEl).tag();
        return tagEl.querySelector('a').getAttribute('href');
      });

      expect(value).toEqual('#');
    });

    test('can be a hyperlnk if defined with a `href` setting', async ({ page }) => {
      const value = await page.evaluate(() => {
        const tagEl = document.createElement('span');
        tagEl.classList.add('tag');
        document.body.appendChild(tagEl);
        tagEl.insertAdjacentHTML('afterbegin', '<span class="tag-content">This is a Tag!</span>');
        $(tagEl).tag({
          href: 'https://www.example.com'
        });
        return tagEl.querySelector('.tag-content').getAttribute('href');
      });

      expect(value).toEqual('https://www.example.com');
    });

    test('should remain a hyperlink if invoked as a hyperlink/anchor with no "href" attribute', async ({ page }) => {
      const value = await page.evaluate(() => {
        const tagEl = document.createElement('span');
        tagEl.classList.add('tag');
        document.body.appendChild(tagEl);
        tagEl.insertAdjacentHTML('afterbegin', '<a class="tag-content">This is a Tag!</a>');
        $(tagEl).tag();
        return tagEl.querySelector('a').getAttribute('href');
      });

      expect(value).toEqual(null);
    });

    test('can change its "style" when updating', async ({ page }) => {
      const value = await page.evaluate(() => {
        const tagEl = document.createElement('span');
        tagEl.classList.add('tag');
        document.body.appendChild(tagEl);
        tagEl.insertAdjacentHTML('afterbegin', '<a class="tag-content">This is a Tag!</a>');
        $(tagEl).tag({
          style: 'info'
        });
        const isInfo = tagEl.classList.contains('info');
        return isInfo;
      });

      expect(value).toEqual(true);
    });

  });
});
