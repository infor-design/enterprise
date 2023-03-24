const { getConfig } = require('../../helpers/e2e-utils');

describe('Tag', () => {
  const baseUrl = 'http://localhost:4000/components/tag';
  const tag = '.tag-list .tag:first-child';

  describe('Index', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.setViewport({ width: 1200, height: 800 });
    });

    it.skip('should not visually regress', async () => {
      expect(await page.waitForSelector('#maincontent')).toBeTruthy();

      // Screenshot of the main content
      const mainContent = await page.$('#maincontent');
      const image = await mainContent.screenshot();

      // Custom name of screenshot
      const config = getConfig('tag-index');
      expect(image).toMatchImageSnapshot(config);
    });

    it.skip('should not change the standard tag', async () => {
      expect(await page.waitForSelector(tag, { visible: true })).toBeTruthy();

      const standardTag = await page.$(tag);
      const image = await standardTag.screenshot();

      const config = getConfig('tag-standard');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Linkable', () => {
    const url = `${baseUrl}/example-linkable`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should display caret right icon correctly', async () => {
      expect(await page.waitForSelector('#linkable-tag', { visible: true })).toBeTruthy();
      expect(await page.waitForSelector('.tag-list .is-linkable > a + .btn-linkable', { visible: true })).toBeTruthy();
    });
  });

  describe('Dismissible and Clickable', () => {
    const url = `${baseUrl}/example-dismissible-and-clickable`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('should not change the dismissible and linkable tags', async () => {
      expect(await page.waitForSelector(tag, { visible: true })).toBeTruthy();

      const dismissibleTag = await page.$(tag);
      const image = await dismissibleTag.screenshot();

      const config = getConfig('tag-dismissible-clickable');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Disabled', () => {
    const url = `${baseUrl}/example-disabled`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it.skip('should not change disabled tag', async () => {
      expect(await page.waitForSelector(tag, { visible: true })).toBeTruthy();

      const disabledTag = await page.$(tag);
      const image = await disabledTag.screenshot();

      const config = getConfig('tag-disabled');
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
