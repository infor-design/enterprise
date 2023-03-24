
const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Accordion Puppeteer Test', () => {
  const baseUrl = 'http://localhost:4000/components/accordion';

  describe('Allow One Pane', () => {
    const url = `${baseUrl}/example-allow-one-pane.html`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should only allow one pane open at a time', async () => {
      expect((await page.$$('.accordion-pane.is-expanded')).length).toEqual(0);

      await page.click('#accordion-one-pane > div:nth-child(1) button');

      await page.waitForSelector('#accordion-one-pane .accordion-pane.is-expanded', { visible: true });

      expect((await page.$$('.accordion-pane.is-expanded')).length).toEqual(1);
    });
  });

  describe.skip('Panels', () => {
    const url = `${baseUrl}/test-accordion-panels.html`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should have panels', async () => {
      await page.waitForFunction('document.querySelectorAll(".accordion.panel").length > 0');
      expect((await page.$$('.accordion.panel')).length).toEqual(4);
    });
  });

  describe('Ajax', () => {
    const url = `${baseUrl}/test-ajax.html`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
      await page.waitForSelector('#ajax-accordion .accordion-header', { visible: true });
    });

    it('should have ajax data in headers', async () => {
      await page.click('#ajax-accordion .accordion-header button');

      await page.waitForSelector('#ajax-accordion .accordion-pane.is-expanded > .accordion-header:first-child span', { visible: true })
        .then(element => element.getProperty('textContent'))
        .then(textContent => textContent.jsonValue())
        .then(textContentString => expect(textContentString).toEqual('Apples'));
    });
  });

  describe('Lazy Loading', () => {
    const url = `${baseUrl}/test-lazy-loading.html`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should load data when header is clicked', async () => {
      await page.click('#ajax-accordion .accordion-header button');

      await page.waitForSelector('#ajax-accordion .accordion-pane.is-expanded > .accordion-header:first-child span', { visible: true })
        .then(element => element.getProperty('textContent'))
        .then(textContent => textContent.jsonValue())
        .then(textContentString => expect(textContentString).toEqual('Apples'));
    });
  });

  describe('Collapse Children', () => {
    const url = `${baseUrl}/test-close-children-on-collapse`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should close all children components', async () => {
      await page.click('#start-test');
      await page.waitForTimeout(2600);

      expect((await page.$$('#dropdown-list')).length).toBe(0);
      expect((await page.$$('#monthview-popup')).length).toBe(0);
    });
  });

  describe('Disabled', () => {
    const url = `${baseUrl}/example-disabled?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should be disabled', async () => {
      expect((await page.$$('.accordion-header.is-disabled')).length).toBe(4);
      expect((await page.$$('.accordion.is-disabled')).length).toBe(1);
    });

    it.skip('should not visual regress', async () => {
      await page.waitForFunction('document.querySelectorAll("div[role=main]").length > 0');
      await page.waitForTimeout(1000);
      const img = await page.screenshot();
      const sConfig = getConfig('accordion-disabled');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Index', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should display accordion', async () => {
      expect(await page.$('.accordion')).toBeTruthy();
    });

    it('should be expanded', async () => {
      await (await page.$$('button'))[0].click();

      expect(await page.$('[aria-expanded="true"]')).toBeTruthy();
    });

    it('should have keyboard be working on focus', async () => {
      const accordionEl = await page.$('.accordion-header:nth-child(1)');

      await page.mouse.move(1000, 40);
      await accordionEl.click();

      expect(await page.$('.is-focused')).toBeTruthy();

      await accordionEl.click();
      await page.keyboard.press('ArrowDown');

      expect(await page.$('.is-focused')).toBeTruthy();
    });

    it('should expand using keyboard', async () => {
      const accordionEl = (await page.$$('.accordion-header'))[0];

      await page.mouse.move(1000, 40);
      await accordionEl.click();

      expect(await page.$('.is-expanded')).toBeTruthy();

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      expect(await page.$('.is-expanded')).toBeTruthy();
    });

    it.skip('should not visual regress', async () => {
      await page.click('button:nth-child(2)');
      await page.waitForTimeout(1000);
      const img = await page.screenshot();
      const sConfig = getConfig('accordion');
      expect(img).toMatchImageSnapshot(sConfig);
    });
  });

  describe('Expand', () => {
    const url = `${baseUrl}/test-expand-all`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should expand both panes', async () => {
      expect((await page.$$('#nested-accordion > .accordion-header.is-expanded')).length).toEqual(2);

      const panes = await page.$$('#nested-accordion > .accordion-header.is-expanded + .accordion-pane.is-expanded');

      expect((await panes[0].boundingBox()).height).not.toBeLessThan(50);
      expect((await panes[1].boundingBox()).height).not.toBeLessThan(50);
    });
  });

  describe('Adding Headers Dynamically', () => {
    const url = `${baseUrl}/test-add-dynamically.html?layout=nofrills`;

    beforeEach(async () => {
      await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    });

    it('should dynamically add and navigate to new accordion headers', async () => {
      await page.click('#addFavs');
      await page.click('#addFavs');

      const header = await page.$$('#test-accordion > .accordion-header');

      await header[header.length - 1].click();

      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      await page.evaluateHandle(() => document.activeElement.textContent)
        .then(textContent => textContent.jsonValue())
        .then(textContentString => expect(textContentString).toEqual('Dynamically-Added Favorite (1)'));
    });
  });
});
