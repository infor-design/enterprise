const { getConfig } = require('../../helpers/e2e-utils.js');

describe('Colors Puppeteer Tests', () => {
  const baseUrl = 'http://localhost:4000/components/colors';

  describe('Colors Classic Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should not visual regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.palette-grid')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('color-index-classic');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Colors New Theme Tests', () => {
    const url = `${baseUrl}/example-index?theme=classic&layout=nofrills`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    it('should show the title', async () => {
      await expect(page.title()).resolves.toMatch('IDS Enterprise');
    });

    it('should not visual regress', async () => {
      await page.setViewport({ width: 1200, height: 800 });

      expect(await page.waitForSelector('.palette-grid')).toBeTruthy();

      const image = await page.screenshot();
      const config = getConfig('color-index-new-theme');
      expect(image).toMatchImageSnapshot(config);
    });
  });

  describe('Status color and border tests', () => {
    const url = `${baseUrl}/example-index`;

    beforeAll(async () => {
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    });

    let hasFailed = false;
    const checkElementsClassname = async (selector, element, type) => {
      const elHandleArray = await page.$$(selector);
      let index = 1;
      // eslint-disable-next-line no-restricted-syntax
      for await (const eL of elHandleArray) {
        await eL.click();
        await page.waitForSelector('.palette-label', { visible: true });
        const elemHandle = await page.$(`${selector}:nth-child(${index})  ${element}`);
        const elemClass = await page.evaluate(elem => elem.getAttribute('class'), elemHandle);
        try {
          switch (index) {
            case 1:
              expect(elemClass).toContain(`status-0${index}-${type}`);
              break;
            case 2:
              expect(elemClass).toContain(`status-0${index}-${type}`);
              break;
            case 3:
              expect(elemClass).toContain(`status-0${index}-${type}`);
              break;
            case 4:
              expect(elemClass).toContain(`status-0${index}-${type}`);
              break;
            case 5:
              expect(elemClass).toContain(`status-0${index}-${type}`);
              break;
            default:
              hasFailed = true;
          }
        } catch (error) {
          hasFailed = true;
        }
        index += 1;
      }
      return hasFailed;
    };
    it('should have classes for status color borders', async () => {
      await checkElementsClassname('#maincontent > div:nth-child(5) > .palette-column', '> div', 'border');
      expect(await checkElementsClassname()).not.toBeTruthy();
    });

    it('should have classes for status colors for svg', async () => {
      await checkElementsClassname('#maincontent > div:nth-child(7) > .palette-column', '> div > svg', 'color');
      expect(await checkElementsClassname()).not.toBeTruthy();
    });
  });
});
