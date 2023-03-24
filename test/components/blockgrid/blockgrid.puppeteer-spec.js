
const { getConfig } = require('../../helpers/e2e-utils.js');

/* eslint-disable compat/compat */
describe('Blockgrid Puppeteer Test', () => {
  const baseUrl = 'http://localhost:4000/components/blockgrid';

  const checkExists = (selector, num = 1, isEqual = false) => page.$$(selector).then((elementArr) => {
    if (isEqual) {
      expect(elementArr.length).toEqual(num);
    } else {
      expect(elementArr.length).toBeGreaterThanOrEqual(num);
    }
  });

  const hasClass = (element, className, toContain = true) => element.evaluate(el => el.className).then((cn) => {
    if (toContain) {
      expect(cn).toContain(className);
    } else {
      expect(cn).not.toContain(className);
    }
  });

  describe('Index tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should have a block', async () => {
      await checkExists('.block');
    });

    it('should have a blockgrid', async () => {
      await checkExists('.blockgrid');
    });
  });

  describe('Mixed selection tests', () => {
    const url = `${baseUrl}/example-mixed-selection`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should have a blockgrid mixed selection', async () => {
      await checkExists('.blockgrid');
    });

    it('should have a block mixed selection', async () => {
      await checkExists('.block');
    });

    it('should blocks be selectable', async () => {
      await checkExists('.is-selectable');
    });

    it('should block highlight after clicked', async () => {
      const blockEl = await page.$('.block.is-selectable:nth-child(1)');
      await blockEl.click();
      await page.click("label[for='checkbox0']");

      await hasClass(blockEl, 'is-selected');
    });

    it('should be able to set id/automation id example one', async () => {
      const checkAttr = (select, val1, val2) => page.$eval(select, element => [element.id, element.getAttribute('data-automation-id')])
        .then((attr) => {
          expect(attr[0]).toEqual(val1);
          expect(attr[1]).toEqual(val2);
        });

      const promises = [];

      for (let i = 0; i < 5; i++) {
        promises.push(checkAttr(`#checkbox${i}`, `checkbox${i}`, `automation-id-example1-blockgrid-checkbox${i}`));
        promises.push(checkAttr(`#example1-blockgrid-checkbox-label${i}`, `example1-blockgrid-checkbox-label${i}`, `automation-id-example1-blockgrid-checkbox-label${i}`));
      }

      await Promise.all(promises);
    });
  });

  describe('Mixed selection responsive tests', () => {
    const url = `${baseUrl}/example-mixed-selection?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it.skip('should not visual regress', async () => {
      const img = await page.screenshot();
      const sConfig = getConfig('blockgrid');
      expect(img).toMatchImageSnapshot(sConfig);
    });

    it.skip('should not visual regress at 500px', async () => {
      const windowSize = await page.viewport();
      await page.setViewport({ width: 500, height: windowSize.height });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

      const img = await page.screenshot();
      const sConfig = getConfig('blockgrid-500px');
      expect(img).toMatchImageSnapshot(sConfig);

      await page.setViewport(windowSize);
    });

    it.skip('should not visual regress at 320px', async () => {
      const windowSize = await page.viewport();
      await page.setViewport({ width: 320, height: windowSize.height });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

      const img = await page.screenshot();
      const sConfig = getConfig('blockgrid-320px');
      expect(img).toMatchImageSnapshot(sConfig);

      await page.setViewport(windowSize);
    });
  });

  describe('Multiselect tests', () => {
    const url = `${baseUrl}/example-multiselect`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should select multiple blocks', async () => {
      const blockArr = await page.$$('.block.is-selectable');

      await blockArr[1].click();
      await blockArr[2].click();
      await blockArr[3].click();

      await page.waitForFunction('document.querySelectorAll(".block.is-selected").length === 3');
      await checkExists('.block.is-selected', 3, true);
    });

    it('should be able to select at 320px', async () => {
      const windowSize = await page.viewport();
      await page.setViewport({ width: 320, height: windowSize.height });
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

      const blockArr = await page.$$('.block.is-selectable');

      await blockArr[1].click();
      await blockArr[2].click();

      await page.waitForFunction('document.querySelectorAll(".block.is-selected").length === 2');
      await checkExists('.block.is-selected', 2, true);

      await page.setViewport(windowSize);
    });

    it('should have a blockgrid', async () => {
      await checkExists('.blockgrid');
    });

    it('should have a block', async () => {
      await checkExists('.block');
    });

    it('should blocks be selectable', async () => {
      await checkExists('.is-selectable');
    });

    it('should highlight blocks after click', async () => {
      const blockArr = await page.$$('.block.is-selectable');
      await blockArr[1].click();
      await page.waitForFunction('document.querySelectorAll(".block.is-selected").length === 1');
      await hasClass(blockArr[1], 'is-selected');

      await blockArr[2].click();
      await page.waitForFunction('document.querySelectorAll(".block.is-selected").length === 2');
      await hasClass(blockArr[2], 'is-selected');
    });
  });

  describe('Singleselect tests', () => {
    const url = `${baseUrl}/example-singleselect`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should select only 1 block', async () => {
      const blockArr = await page.$$('.block.is-selectable');

      await blockArr[1].click();
      await blockArr[2].click();
      await blockArr[3].click();

      await page.waitForFunction('document.querySelectorAll(".block.is-selected").length === 1');

      await hasClass(blockArr[3], 'is-selected');
      await hasClass(blockArr[2], 'is-selected', false);
      await hasClass(blockArr[1], 'is-selected', false);
    });

    it('should have a blockgrid', async () => {
      await checkExists('.blockgrid');
    });

    it('should have a block', async () => {
      await checkExists('.block');
    });

    it('should blocks be selectable', async () => {
      await checkExists('.is-selectable');
    });
  });

  describe('Text tests', () => {
    const url = `${baseUrl}/example-text`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should have a blockgrid in the page', async () => {
      await checkExists('.row.blockgrid.l-center');
    });

    it('should have a block in the page', async () => {
      await checkExists('.block');
    });

    it('should have a text in the page', async () => {
      await checkExists('p');
    });
  });

  describe('Paging tests', () => {
    const url = `${baseUrl}/example-paging`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should select block, navigate to 2nd page, navigate back, block should still be selected', async () => {
      const blockArr = await page.$$('.block.is-selectable');
      await blockArr[2].click();

      await page.click('.pager-toolbar li:nth-child(2)');
      await page.click('.pager-toolbar li:nth-child(1)');

      await hasClass(blockArr[2], 'is-selected');
    });

    it('should navigate to 2nd page, navigate back via keyboard', async () => {
      const blockArr = await page.$$('.block.is-selectable');

      await blockArr[1].press('Tab');
      await page.keyboard.press('Space');
      await hasClass(blockArr[2], 'is-selected');

      await page.keyboard.press('Tab');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      await checkExists('.block.is-selected', 1, true);
      await hasClass(blockArr[2], 'is-selected');
    });
  });
});
